package main

import "strings"

// ユーザーエージェントからデバイス名を取得
func getDevice(agent string) string {
	if strings.Contains(agent, "Windows NT") {
		return "Windows"
	} else if strings.Contains(agent, "Windows Phone OS") {
		return "Windows Phone"
	} else if strings.Contains(agent, "Macintosh") {
		return "Mac"
	} else if strings.Contains(agent, "iPhone") {
		return "iPhone"
	} else if strings.Contains(agent, "iPad") {
		return "iPad"
	} else if strings.Contains(agent, "iPod") {
		return "iPod touch"
	} else if strings.Contains(agent, "Android") {
		return "Android"
	} else if strings.Contains(agent, "Linux") {
		return "Linux"
	} else if strings.Contains(agent, "SunOS") {
		return "Linux"
	} else if strings.Contains(agent, "FreeBSD") {
		return "Linux"
	} else if strings.Contains(agent, "OpenBSD") {
		return "Linux"
	} else if strings.Contains(agent, "Nintendo 3DS") {
		return "Nintendo 3DS"
	} else if strings.Contains(agent, "Nintendo WiiU") {
		return "Nintendo WiiU"
	} else if strings.Contains(agent, "Nintendo Switch") {
		return "Nintendo Switch"
	}
	return "Others"
}
