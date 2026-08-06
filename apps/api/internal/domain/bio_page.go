package domain

import (
	"time"
)

// BioPageItem represents a link-in-bio page item.
type BioPageItem struct {
	ID               string    `json:"id"`
	Name             string    `json:"name"`
	URL              string    `json:"url"`
	Logo             string    `json:"logo"`
	Views            string    `json:"views"`
	ClicksCount      int       `json:"clicks_count"`
	MarketingChannel string    `json:"marketing_channel"`
	ClientName       string    `json:"client_name"`
	WidgetsUsed      string    `json:"widgets_used"`
	CreationDate     time.Time `json:"creation_date"`
}

// CallLogItem represents a voice call history record.
type CallLogItem struct {
	ID        string    `json:"id"`
	Type      string    `json:"type"`
	Duration  string    `json:"duration"`
	Outcome   string    `json:"outcome"`
	CallFlow  string    `json:"call_flow"`
	TimeDate  time.Time `json:"time_date"`
	Summary   string    `json:"summary"`
}

// SignerDocItem represents an electronic document signature flow.
type SignerDocItem struct {
	ID         string    `json:"id"`
	Title      string    `json:"title"`
	Recipient  string    `json:"recipient"`
	Position   string    `json:"position"`
	SignedAt   *time.Time`json:"signed_at,omitempty"`
	Signature  string    `json:"signature,omitempty"`
	Status     string    `json:"status"` // overview, review, signed
}
