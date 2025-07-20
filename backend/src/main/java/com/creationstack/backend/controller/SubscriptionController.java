package com.creationstack.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.creationstack.backend.dto.Subscription.ActivateSubscriptionRequestDto;
import com.creationstack.backend.dto.Subscription.SubscriptionRequestDto;
import com.creationstack.backend.dto.Subscription.SubscriptionResponseDto;
import com.creationstack.backend.repository.UserDetailRepository;
import com.creationstack.backend.service.SubscriptionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final UserDetailRepository userRepository;

    // 구독 생성 요청
    @PostMapping("/subscriptions/pending")
    public ResponseEntity<SubscriptionResponseDto> createPending(
            Authentication authentication,
            // @RequestBody User user,
            @RequestBody SubscriptionRequestDto request) {
        Long subscriberId = Long.parseLong(authentication.getName()); // userId from JWT

        // Long subscriberId = user.getUserId();
        // 구독 생성 요청subscriberId
        // Long subscriberId = 2L;
        SubscriptionResponseDto response = subscriptionService.createPendingSubscription(subscriberId, request);
        return ResponseEntity.ok(response);
    }

    // 결제 성공 시 구독 상태 ACTIVE로 변경
    @PostMapping("/subscriptions/{subscriptionId}/activate")
    public ResponseEntity<String> activateSubscription(
            @PathVariable Long subscriptionId,
            @RequestBody ActivateSubscriptionRequestDto dto) {
        log.info("구독 활성화 시작");
        subscriptionService.activateSubscription(subscriptionId, dto.getPaymentId());
        return ResponseEntity.ok("구독이 활성화되었습니다.");
    }

    // 결제 실패 시 처리
    @PostMapping("/subscriptions/{subscriptionId}/fail")
    public ResponseEntity<String> failSubscription(@PathVariable Long subscriptionId) {
        subscriptionService.handleSubscriptionFailure(subscriptionId);
        return ResponseEntity.ok("구독 실패 처리가 완료되었습니다.");
    }

}
