package com.creationstack.backend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@Table(name = "subscriptions", // 한 유저가 같은 크리에이터를 두 번 구독 못하게 제한
        uniqueConstraints = @UniqueConstraint(
                name = "subscriber_creator", columnNames = {"subscriber_id", "creator_id"}))
@NoArgsConstructor
@AllArgsConstructor
public @Entity class Subscription { // 구독 테이블

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subscription_id")
    private Long subscriptionId; // 구독 테이블 기본키

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscriber_id", nullable = false)
    private User subscriber; // 구독하는 유저

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator; // 크리에이터 유저

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_method_id", nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status = SubscriptionStatus.ACTIVE;
    // 현재 구독 상태, 기본값은 유지 중

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt; // 구독 시작일

    @Column(name = "next_payment_at", nullable = false)
    private LocalDateTime nextPaymentAt; // 다음 결제 예정일

    @Column(name = "last_payment_at")
    private LocalDateTime lastPaymentAt; // 마지막 결제일

    @Column(name = "scheduleId", length = 255)
    private String scheduleId; // 정기결제용 PG 고유 ID
}
