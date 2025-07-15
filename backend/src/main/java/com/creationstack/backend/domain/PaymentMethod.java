package com.creationstack.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@Table(name = "payment_method")
@NoArgsConstructor
@AllArgsConstructor
public @Entity class PaymentMethod { // 결제 수단 테이블

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_method_id")
    private Long paymentMethodId; // 결제 수단 테이블 기본키

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 유저

    @Column(name = "billing_key", length = 255)
    private String billingKey; // 정기결제용 PG사 키

    @Column(name = "card_name", length = 100, nullable = false)
    private String cardName; // 카드사 이름

    @Column(name = "card_number", length = 50, nullable = false)
    private String cardNumber; // 마스킹된 카드번호

    @Column(name = "card_type", length = 50)
    private String cardType; // 신용(CREDIT), 체크(DEBIT) 영문명 기입

    @Column(name = "card_brand", length = 50)
    private String cardBrand; // 카드 브랜드

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 결제수단 등록한 시간
}
