package main

import "strings"

// ユーザーエージェントからブラウザ名を取得
func getBrowser(agent string) string {
	if strings.Contains(agent, "MSIE") {
		return "Internet Explorer"
	} else if strings.Contains(agent, "Edge") {
		return "Edge"
	} else if strings.Contains(agent, "Chrome") {
		return "Chrome"
	} else if strings.Contains(agent, "Firefox") {
		return "Firefox"
	} else if strings.Contains(agent, "Safari") {
		return "Safari"
	} else if strings.Contains(agent, "Opera") {
		return "Opera"
	} else if strings.Contains(agent, "Sleipnir") {
		return "Sleipnir"
	} else if strings.Contains(agent, "Nintendo 3DS") {
		return "3DS Internet Browser"
	} else if strings.Contains(agent, "Nintendo WiiU") {
		return "WiiU Internet Browser"
	} else if strings.Contains(agent, "Nintendo Switch") {
		return "Switch Internet Browser"
	}
	return "Others"
}
