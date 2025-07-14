package com.creationstack.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@Table(name = "payments")
@NoArgsConstructor
@AllArgsConstructor
public @Entity class Payment { // 결제 테이블

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId; // 결제 테이블 기본키

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id", nullable = false)
    private Subscription subscription; // 결제하려는 구독

    @Column(nullable = false)
    private int amount; // 결제 금액

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus; // 결제 처리 결과

    @Column(name = "payment_at", nullable = false)
    private LocalDateTime paymentAt; // 실제 결제가 시도된 날짜/시간

    @Column(name = "transaction_id", length = 255)
    private String transactionId; // PG사(결제 대행사)에서 발급한 거래 고유 번호

    @Column(name = "failure_reason")
    private String failureReason; // 결제 실패 시, 사유 메시지 저장

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt; // 결제가 처음 저장된 시간, 자동생성
}
