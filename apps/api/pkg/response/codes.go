package response

type AppCode struct {
	Code        int64
	Description string
}

var (
	CodeSuccess             = AppCode{1, "SUCCESS"}
	CodeBadRequest          = AppCode{400, "Bad Request"}
	CodeUnauthorized        = AppCode{401, "Unauthorized"}
	CodeForbidden           = AppCode{403, "Forbidden"}
	CodeNotFound            = AppCode{404, "Resource not found"}
	CodeConflict            = AppCode{409, "Conflict"}
	CodeValidationFailed    = AppCode{422, "Validation failed"}
	CodeInternal            = AppCode{500, "Internal Server Error"}
	CodeIELTSContentMissing = AppCode{2404, "IELTS content not found"}
	CodeIELTSAttemptMissing = AppCode{2405, "IELTS attempt not found"}
	CodeIELTSInvalidAnswer  = AppCode{2406, "IELTS answer payload is invalid"}
	CodeIELTSAdminFailed    = AppCode{2500, "IELTS admin operation failed"}
)

func CodeFromHTTP(status int, description string) AppCode {
	if description == "" {
		description = "ERROR"
	}
	switch status {
	case 400:
		return AppCode{Code: CodeBadRequest.Code, Description: description}
	case 401:
		return AppCode{Code: CodeUnauthorized.Code, Description: description}
	case 403:
		return AppCode{Code: CodeForbidden.Code, Description: description}
	case 404:
		return AppCode{Code: CodeNotFound.Code, Description: description}
	case 409:
		return AppCode{Code: CodeConflict.Code, Description: description}
	case 422:
		return AppCode{Code: CodeValidationFailed.Code, Description: description}
	case 500:
		return AppCode{Code: CodeInternal.Code, Description: description}
	default:
		return AppCode{Code: int64(status), Description: description}
	}
}
