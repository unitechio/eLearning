package domain

import (
	"time"
)

// CustomerAccount represents a CRM customer account item.
type CustomerAccount struct {
	ID                 string `json:"id"`
	Name               string `json:"name"`
	Logo               string `json:"logo"`
	LeadName           string `json:"lead_name"`
	LeadAvatar         string `json:"lead_avatar"`
	LegalName          string `json:"legal_name"`
	Email              string `json:"email"`
	Website            string `json:"website"`
	Location           string `json:"location"`
	Founded            string `json:"founded"`
	Founders           string `json:"founders"`
	Crunchbase         string `json:"crunchbase"`
	Employees          string `json:"employees"`
	ResponseRate       string `json:"response_rate"`
	EmailExchangeRate  string `json:"email_exchange_rate"`
	NPSScore           string `json:"nps_score"`
	RetentionRate      string `json:"retention_rate"`
}

// SiteItem represents an infrastructure site asset.
type SiteItem struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	Partner       string `json:"partner"`
	DeployedUnits int    `json:"deployed_units"`
	ActiveCharges int    `json:"active_charges"`
	IncidentsNow  string `json:"incidents_now"`
	State         string `json:"state"`
	Location      string `json:"location"`
	Added         string `json:"added"`
}

// DomainSubItem represents a domain subscription purchase record.
type DomainSubItem struct {
	ID            string `json:"id"`
	PaymentStatus string `json:"payment_status"`
	DomainsQty    string `json:"domains_qty"`
	DomainsName   string `json:"domains_name"`
	Cost          string `json:"cost"`
	NextBilling   string `json:"next_billing"`
}

// DeliveryPackageItem represents a tracked package delivery item.
type DeliveryPackageItem struct {
	TrackingNumber   string    `json:"tracking_number"`
	DriverName       string    `json:"driver_name"`
	DriverVehicle    string    `json:"driver_vehicle"`
	PickupLocation   string    `json:"pickup_location"`
	PickupTime       string    `json:"pickup_time"`
	DeliveryLocation string    `json:"delivery_location"`
	EstDeliveryTime  string    `json:"est_delivery_time"`
	WeightDimensions string    `json:"weight_dimensions"`
	Contents         string    `json:"contents"`
	Signature        string    `json:"signature"`
	Instructions     string    `json:"instructions"`
	CreatedAt        time.Time `json:"created_at"`
}
