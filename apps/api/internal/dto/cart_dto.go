package dto

import "time"

type CartCheckoutRequest struct {
	CourseIDs   []string `json:"course_ids" binding:"required"`
	VoucherCode string   `json:"voucher_code"`
	Provider    string   `json:"provider"` // vnpay, stripe, sandbox
}

type ApplyVoucherRequest struct {
	Code       string  `json:"code" binding:"required"`
	CartAmount float64 `json:"cart_amount" binding:"required"`
}

type ApplyVoucherResponse struct {
	DiscountAmount float64 `json:"discount_amount"`
	NetAmount      float64 `json:"net_amount"`
	Active         bool    `json:"active"`
}

type VoucherDTO struct {
	ID        string    `json:"id"`
	Code      string    `json:"code"`
	Discount  float64   `json:"discount"`
	Type      string    `json:"type"` // fixed or percent
	ExpiresAt time.Time `json:"expires_at"`
	IsActive  bool      `json:"is_active"`
}

type UpsertVoucherRequest struct {
	Code      string  `json:"code" binding:"required"`
	Discount  float64 `json:"discount" binding:"required"`
	Type      string  `json:"type" binding:"required"` // fixed or percent
	ExpiresAt string  `json:"expires_at" binding:"required"` // YYYY-MM-DD
	IsActive  bool    `json:"is_active"`
}
