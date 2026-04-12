package model

import (
	"time"

	"github.com/google/uuid"
)

// PostStatistics represents detailed traffic statistics for a post
type PostStatistics struct {
	BaseModel
	PostID          uint      `gorm:"uniqueIndex;not null" json:"post_id"`
	Date            time.Time `gorm:"type:date;not null;index:idx_post_stats_date" json:"date"`
	ViewCount       int64     `gorm:"default:0" json:"view_count"`
	UniqueViews     int64     `gorm:"default:0" json:"unique_views"`
	LikeCount       int64     `gorm:"default:0" json:"like_count"`
	ShareCount      int64     `gorm:"default:0" json:"share_count"`
	CommentCount    int64     `gorm:"default:0" json:"comment_count"`
	AvgReadTime     int       `gorm:"default:0" json:"avg_read_time"` // in seconds
	BounceRate      float64   `gorm:"type:decimal(5,2);default:0" json:"bounce_rate"`
	ReferrerSources string    `gorm:"type:jsonb" json:"referrer_sources"` // JSON: {"google": 100, "facebook": 50}
	DeviceTypes     string    `gorm:"type:jsonb" json:"device_types"`     // JSON: {"mobile": 60, "desktop": 40}
	Countries       string    `gorm:"type:jsonb" json:"countries"`        // JSON: {"VN": 80, "US": 20}

	// Relationships
	Post Post `gorm:"foreignKey:PostID" json:"post,omitempty"`
}

// TableName specifies the table name for PostStatistics
func (PostStatistics) TableName() string {
	return "post_statistics"
}

// PostView represents individual post view tracking
type PostView struct {
	BaseModel
	PostID     uint       `gorm:"not null;index:idx_post_view_post" json:"post_id"`
	UserID     *uuid.UUID `gorm:"type:uuid;index:idx_post_view_user" json:"user_id,omitempty"`
	IPAddress  string     `gorm:"size:45" json:"ip_address"`
	UserAgent  string     `gorm:"size:500" json:"user_agent"`
	Referrer   string     `gorm:"size:500" json:"referrer"`
	Country    string     `gorm:"size:2" json:"country"`      // ISO country code
	DeviceType string     `gorm:"size:20" json:"device_type"` // mobile, desktop, tablet
	ReadTime   int        `gorm:"default:0" json:"read_time"` // in seconds
	ViewedAt   time.Time  `gorm:"not null;index:idx_post_view_date" json:"viewed_at"`

	// Relationships
	Post Post  `gorm:"foreignKey:PostID" json:"post,omitempty"`
	User *User `gorm:"foreignKey:UserID;references:ID" json:"user,omitempty"`
}

// TableName specifies the table name for PostView
func (PostView) TableName() string {
	return "post_views"
}

// PostLike represents post likes
type PostLike struct {
	BaseModel
	PostID  uint      `gorm:"not null;index:idx_post_like" json:"post_id"`
	UserID  uuid.UUID `gorm:"type:uuid;not null;index:idx_post_like" json:"user_id"`
	LikedAt time.Time `gorm:"not null" json:"liked_at"`

	// Relationships
	Post Post `gorm:"foreignKey:PostID" json:"post,omitempty"`
	User User `gorm:"foreignKey:UserID;references:ID" json:"user,omitempty"`
}

// TableName specifies the table name for PostLike
func (PostLike) TableName() string {
	return "post_likes"
}

// PostShare represents post shares
type PostShare struct {
	BaseModel
	PostID   uint       `gorm:"not null;index:idx_post_share" json:"post_id"`
	UserID   *uuid.UUID `gorm:"type:uuid;index:idx_post_share_user" json:"user_id,omitempty"`
	Platform string     `gorm:"size:50" json:"platform"` // facebook, twitter, linkedin, etc.
	SharedAt time.Time  `gorm:"not null" json:"shared_at"`

	// Relationships
	Post Post  `gorm:"foreignKey:PostID" json:"post,omitempty"`
	User *User `gorm:"foreignKey:UserID;references:ID" json:"user,omitempty"`
}

// TableName specifies the table name for PostShare
func (PostShare) TableName() string {
	return "post_shares"
}

// PostComment represents post comments
type PostComment struct {
	BaseModel
	PostID      uint       `gorm:"not null;index:idx_post_comment" json:"post_id"`
	UserID      *uuid.UUID `gorm:"type:uuid;index:idx_post_comment_user" json:"user_id,omitempty"`
	ParentID    *uint      `json:"parent_id,omitempty"`
	Content     string     `gorm:"type:text;not null" json:"content"`
	AuthorName  string     `gorm:"size:200" json:"author_name"`                      // For guest comments
	AuthorEmail string     `gorm:"size:200" json:"author_email"`                     // For guest comments
	Status      string     `gorm:"type:varchar(20);default:'pending'" json:"status"` // pending, approved, spam
	IPAddress   string     `gorm:"size:45" json:"ip_address"`

	// Relationships
	Post    Post          `gorm:"foreignKey:PostID" json:"post,omitempty"`
	User    *User         `gorm:"foreignKey:UserID;references:ID" json:"user,omitempty"`
	Parent  *PostComment  `gorm:"foreignKey:ParentID" json:"parent,omitempty"`
	Replies []PostComment `gorm:"foreignKey:ParentID" json:"replies,omitempty"`
}

// TableName specifies the table name for PostComment
func (PostComment) TableName() string {
	return "post_comments"
}
