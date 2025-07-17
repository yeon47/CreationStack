package com.creationstack.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private String paymentId;

  @OneToOne(fetch = FetchType.LAZY)
  private PaymentMethod paymentMethod;

//  @OneToOne(fetch = FetchType.LAZY)
//  private String subscriptionId;
//  private Subscription subscription;

  private int amount;

  @Enumerated(EnumType.STRING)
  private PaymentStatus paymentStatus;

  private String failureReason;

  private LocalDateTime tryAt;

  private LocalDateTime successAt;
}
