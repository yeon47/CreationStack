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
    @JoinColumn(name = "payment_method_id")
    private PaymentMethod paymentMethod; // 결제 수단

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id", nullable = false)
    private Subscription subscription; // 결제하려는 구독

    @Column(nullable = false)
    private int amount; // 결제 금액

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus; // 결제 처리 결과

    @Column(name = "transaction_id", length = 255)
    private String transactionId; // PG사(결제 대행사)에서 발급한 거래 고유 번호

    @Lob
    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason; // 결제 실패 시, 사유 메시지 저장

    @CreationTimestamp
    @Column(name = "try_at", nullable = false)
    private LocalDateTime tryAt; // 결제를 시도한 시간, 자동생성

    @Column(name = "success_at")
    private LocalDateTime successAt; // 결제 성공 시간
}
