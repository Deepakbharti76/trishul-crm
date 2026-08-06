package com.trishul.crm.service;

import com.trishul.crm.entity.Setting;
import com.trishul.crm.repository.SettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final SettingRepository settingRepository;

    public Setting getSettings() {
        return settingRepository.findAll().stream().findFirst()
                .orElseGet(() -> settingRepository.save(Setting.builder()
                        .companyName("Trishul Enterprises Pvt. Ltd.")
                        .companyEmail("info@trishulcrm.com")
                        .currency("INR")
                        .timezone("Asia/Kolkata")
                        .theme("dark")
                        .emailNotifications(true)
                        .smsNotifications(false)
                        .fiscalYearStart("April")
                        .build()));
    }

    @Transactional
    public Setting updateSettings(Setting payload) {
        Setting existing = getSettings();
        existing.setCompanyName(payload.getCompanyName());
        existing.setCompanyEmail(payload.getCompanyEmail());
        existing.setCurrency(payload.getCurrency());
        existing.setTimezone(payload.getTimezone());
        existing.setTheme(payload.getTheme());
        existing.setEmailNotifications(payload.isEmailNotifications());
        existing.setSmsNotifications(payload.isSmsNotifications());
        existing.setFiscalYearStart(payload.getFiscalYearStart());
        return settingRepository.save(existing);
    }
}
