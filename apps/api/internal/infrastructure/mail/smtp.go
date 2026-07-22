package mail

import (
	"bytes"
	"context"
	"crypto/tls"
	"encoding/base64"
	"fmt"
	"mime"
	"mime/multipart"
	"net/smtp"
	"net/textproto"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/unitechio/eLearning/apps/api/internal/config"
	"github.com/unitechio/eLearning/apps/api/internal/domain"
)

type SMTPProvider struct {
	cfg config.EmailConfig
}

func NewSMTPProvider(cfg config.EmailConfig) *SMTPProvider {
	return &SMTPProvider{cfg: cfg}
}

func (p *SMTPProvider) Name() domain.EmailProvider {
	return domain.EmailProviderSMTP
}

func (p *SMTPProvider) Send(ctx context.Context, email domain.EmailData) (string, error) {
	if p.cfg.Host == "" {
		return "", fmt.Errorf("smtp host is not configured")
	}
	from := email.From
	if from == "" {
		from = p.cfg.FromEmail
	}
	if from == "" {
		return "", fmt.Errorf("sender email is not configured")
	}
	messageID := email.ID
	if messageID == "" {
		messageID = uuid.NewString()
	}
	msg, err := buildMIMEMessage(messageID, from, email)
	if err != nil {
		return "", err
	}
	addr := fmt.Sprintf("%s:%d", p.cfg.Host, p.cfg.Port)
	recipients := append(append(append([]string{}, email.To...), email.CC...), email.BCC...)
	errCh := make(chan error, 1)
	go func() {
		errCh <- p.send(addr, from, recipients, msg)
	}()
	select {
	case <-ctx.Done():
		return "", ctx.Err()
	case err := <-errCh:
		if err != nil {
			return "", err
		}
		return messageID, nil
	}
}

func (p *SMTPProvider) send(addr, from string, to []string, msg []byte) error {
	var auth smtp.Auth
	if p.cfg.UserName != "" || p.cfg.Password != "" {
		auth = smtp.PlainAuth("", p.cfg.UserName, p.cfg.Password, p.cfg.Host)
	}
	if !p.cfg.UseSSL {
		return smtp.SendMail(addr, auth, from, to, msg)
	}
	conn, err := tls.Dial("tcp", addr, &tls.Config{ServerName: p.cfg.Host, MinVersion: tls.VersionTLS12})
	if err != nil {
		return err
	}
	defer conn.Close()
	client, err := smtp.NewClient(conn, p.cfg.Host)
	if err != nil {
		return err
	}
	defer client.Quit()
	if auth != nil {
		if err := client.Auth(auth); err != nil {
			return err
		}
	}
	if err := client.Mail(from); err != nil {
		return err
	}
	for _, recipient := range to {
		if err := client.Rcpt(recipient); err != nil {
			return err
		}
	}
	w, err := client.Data()
	if err != nil {
		return err
	}
	if _, err := w.Write(msg); err != nil {
		return err
	}
	return w.Close()
}

type NoopProvider struct{}

func NewNoopProvider() *NoopProvider {
	return &NoopProvider{}
}

func (p *NoopProvider) Name() domain.EmailProvider {
	return domain.EmailProviderSMTP
}

func (p *NoopProvider) Send(ctx context.Context, email domain.EmailData) (string, error) {
	return "noop-" + uuid.NewString(), nil
}

func buildMIMEMessage(messageID, from string, email domain.EmailData) ([]byte, error) {
	var buf bytes.Buffer
	writeHeader(&buf, "Message-ID", "<"+messageID+"@eenglish.local>")
	writeHeader(&buf, "Date", time.Now().Format(time.RFC1123Z))
	writeHeader(&buf, "From", formatAddress("", from))
	writeHeader(&buf, "To", strings.Join(email.To, ", "))
	if len(email.CC) > 0 {
		writeHeader(&buf, "Cc", strings.Join(email.CC, ", "))
	}
	if email.ReplyTo != "" {
		writeHeader(&buf, "Reply-To", email.ReplyTo)
	}
	writeHeader(&buf, "Subject", mime.QEncoding.Encode("utf-8", email.Subject))
	writeHeader(&buf, "MIME-Version", "1.0")
	for key, value := range email.Headers {
		writeHeader(&buf, key, value)
	}

	if len(email.Attachments) == 0 {
		contentType := "text/plain; charset=UTF-8"
		body := email.TextBody
		if email.HTMLBody != "" {
			contentType = "text/html; charset=UTF-8"
			body = email.HTMLBody
		}
		writeHeader(&buf, "Content-Type", contentType)
		writeHeader(&buf, "Content-Transfer-Encoding", "8bit")
		buf.WriteString("\r\n")
		buf.WriteString(body)
		return buf.Bytes(), nil
	}

	writer := multipart.NewWriter(&buf)
	writeHeader(&buf, "Content-Type", `multipart/mixed; boundary="`+writer.Boundary()+`"`)
	buf.WriteString("\r\n")
	bodyHeader := make(textproto.MIMEHeader)
	if email.HTMLBody != "" {
		bodyHeader.Set("Content-Type", "text/html; charset=UTF-8")
		bodyHeader.Set("Content-Transfer-Encoding", "8bit")
		part, err := writer.CreatePart(bodyHeader)
		if err != nil {
			return nil, err
		}
		_, _ = part.Write([]byte(email.HTMLBody))
	} else {
		bodyHeader.Set("Content-Type", "text/plain; charset=UTF-8")
		bodyHeader.Set("Content-Transfer-Encoding", "8bit")
		part, err := writer.CreatePart(bodyHeader)
		if err != nil {
			return nil, err
		}
		_, _ = part.Write([]byte(email.TextBody))
	}
	for _, attachment := range email.Attachments {
		header := make(textproto.MIMEHeader)
		contentType := attachment.ContentType
		if contentType == "" {
			contentType = "application/octet-stream"
		}
		header.Set("Content-Type", contentType)
		disposition := "attachment"
		if attachment.Inline {
			disposition = "inline"
		}
		header.Set("Content-Disposition", fmt.Sprintf(`%s; filename="%s"`, disposition, attachment.Filename))
		header.Set("Content-Transfer-Encoding", "base64")
		if attachment.ContentID != "" {
			header.Set("Content-ID", "<"+attachment.ContentID+">")
		}
		part, err := writer.CreatePart(header)
		if err != nil {
			return nil, err
		}
		encoder := base64.NewEncoder(base64.StdEncoding, part)
		if _, err := encoder.Write(attachment.Content); err != nil {
			return nil, err
		}
		if err := encoder.Close(); err != nil {
			return nil, err
		}
	}
	if err := writer.Close(); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func writeHeader(buf *bytes.Buffer, key, value string) {
	if strings.TrimSpace(value) == "" {
		return
	}
	buf.WriteString(key)
	buf.WriteString(": ")
	buf.WriteString(value)
	buf.WriteString("\r\n")
}

func formatAddress(name, email string) string {
	if name == "" {
		return email
	}
	return mime.QEncoding.Encode("utf-8", name) + " <" + email + ">"
}
