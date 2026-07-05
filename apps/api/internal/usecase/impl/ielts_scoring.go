package impl

import (
	"encoding/json"
	"math"

	"gorm.io/datatypes"
)

func ieltsBandFromRaw(skill string, correct int, total int) float64 {
	if total <= 0 {
		return 0
	}
	if skill == "reading" || skill == "listening" {
		return bandFrom40(correct, total)
	}
	return math.Round((float64(correct)/float64(total))*90) / 10
}

func ieltsProductiveBand(skill string, manualScore float64, criteriaScores datatypes.JSON) float64 {
	if manualScore > 0 {
		return clampBand(roundHalfBand(manualScore))
	}
	scores := map[string]float64{}
	if len(criteriaScores) > 0 {
		_ = json.Unmarshal(criteriaScores, &scores)
	}
	keys := []string{"task_achievement", "coherence_cohesion", "lexical_resource", "grammar"}
	if skill == "speaking" {
		keys = []string{"fluency_coherence", "lexical_resource", "grammar", "pronunciation"}
	}
	total := 0.0
	count := 0
	for _, key := range keys {
		if score := scores[key]; score > 0 {
			total += score
			count++
		}
	}
	if count == 0 {
		return 0
	}
	return clampBand(roundHalfBand(total / float64(count)))
}

func bandFrom40(correct int, total int) float64 {
	raw := correct
	if total != 40 {
		raw = int(math.Round(float64(correct) * 40 / float64(total)))
	}
	switch {
	case raw >= 39:
		return 9
	case raw >= 37:
		return 8.5
	case raw >= 35:
		return 8
	case raw >= 32:
		return 7.5
	case raw >= 30:
		return 7
	case raw >= 26:
		return 6.5
	case raw >= 23:
		return 6
	case raw >= 18:
		return 5.5
	case raw >= 16:
		return 5
	case raw >= 13:
		return 4.5
	case raw >= 10:
		return 4
	case raw >= 6:
		return 3.5
	case raw >= 4:
		return 3
	case raw >= 2:
		return 2.5
	default:
		return 0
	}
}

func overallBand(scores ...float64) float64 {
	total := 0.0
	count := 0
	for _, score := range scores {
		if score > 0 {
			total += score
			count++
		}
	}
	if count == 0 {
		return 0
	}
	avg := total / float64(count)
	return roundHalfBand(avg)
}

func roundHalfBand(score float64) float64 {
	return math.Round(score*2) / 2
}

func clampBand(score float64) float64 {
	if score < 0 {
		return 0
	}
	if score > 9 {
		return 9
	}
	return score
}
