package com.trishul.crm.controller;

import com.trishul.crm.dto.ApiResponse;
import com.trishul.crm.entity.Setting;
import com.trishul.crm.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping
    public ResponseEntity<ApiResponse<Setting>> getSettings() {
        return ResponseEntity.ok(ApiResponse.success("Settings fetched", settingsService.getSettings()));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<Setting>> updateSettings(@RequestBody Setting setting) {
        return ResponseEntity.ok(ApiResponse.success("Settings updated", settingsService.updateSettings(setting)));
    }
}
