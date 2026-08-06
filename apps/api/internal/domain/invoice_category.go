package domain

import (
	"time"
)

// InvoiceCategory represents a chart of account / invoice category item.
type InvoiceCategory struct {
	ID          string            `json:"id"`
	Name        string            `json:"name"`
	Count       int               `json:"count,omitempty"`
	FolderColor string            `json:"folder_color,omitempty"`
	AccountType string            `json:"account_type"` // OPEX, COGS, LIABILITY, MIXED, REVENUE
	TaxRules    string            `json:"tax_rules"`
	Rate        string            `json:"rate"`
	RptCode     string            `json:"rpt_code"`
	Status      string            `json:"status"` // Active, Review, Locked
	Date        string            `json:"date"`
	Children    []InvoiceCategory `json:"children,omitempty"`
}

// BlueprintItem represents a reusable project blueprint.
type BlueprintItem struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Category  string    `json:"category"`
	Type      string    `json:"type"`
	CreatedAt time.Time `json:"created_at"`
}

// AgentRunStep represents a step in an autonomous agent execution.
type AgentRunStep struct {
	ID            string   `json:"id"`
	Title         string   `json:"title"`
	ToolBadge     string   `json:"tool_badge,omitempty"`
	ExecutionTime string   `json:"execution_time,omitempty"`
	Status        string   `json:"status"` // completed, approval_needed, queued
	SubSteps      []string `json:"sub_steps,omitempty"`
}

// QRGenerateRequest represents a request to generate a dynamic QR code.
type QRGenerateRequest struct {
	Name        string `json:"name"`
	Type        string `json:"type"` // Whatsapp, Website, WiFi, vCard, Email
	Alias       string `json:"alias"`
	Domain      string `json:"domain"`
	TextPrompt  string `json:"text_prompt"`
	Template    string `json:"template"`
	Size        string `json:"size"`
	Format      string `json:"format"`
	MatrixStyle string `json:"matrix_style"`
}
