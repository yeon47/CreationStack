package com.creationstack.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.creationstack.backend.dto.Subscription.SubscriptionRequestDto;
import com.creationstack.backend.dto.Subscription.SubscriptionResponseDto;
import com.creationstack.backend.service.SubscriptionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SubscriptionController {
    
    private final SubscriptionService subscriptionService;

    // 구독 생성 요청
    @PostMapping("/subscriptions/pending")
    public ResponseEntity<SubscriptionResponseDto> createPending(
        
    )
    
}
