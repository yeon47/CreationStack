package com.creationstack.backend.service;

import com.creationstack.backend.config.PortOneClient;
import com.creationstack.backend.domain.payment.Payment;
import com.creationstack.backend.domain.payment.PaymentMethod;
import com.creationstack.backend.domain.payment.PaymentStatus;
import com.creationstack.backend.domain.payment.Subscription;
import com.creationstack.backend.dto.Payment.BillingKeyPaymentRequestDto;
import com.creationstack.backend.dto.Payment.BillingKeyPaymentResponseDto;
import com.creationstack.backend.dto.Payment.CustomerDto;
import com.creationstack.backend.dto.Payment.CustomerDto.Name;
import com.creationstack.backend.dto.Payment.PortOneBillingResponseDto;
import com.creationstack.backend.dto.Payment.PortOnePaymentRequestDto;
import com.creationstack.backend.dto.Payment.PortOnePaymentRequestDto.Amount;
import com.creationstack.backend.repository.PaymentRepository;
import com.creationstack.backend.repository.SubscriptionRepository;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

  private final PaymentRepository paymentRepository;
  private final PaymentMethodService paymentMethodService;
  private final PortOneClient portOneClient;
  private final SubscriptionRepository subscriptionRepository;

  //결제
  public BillingKeyPaymentResponseDto processingBillingKeyPay(BillingKeyPaymentRequestDto req) {
    log.info("[processingBillingKeyPay] req paymentMethodId: {}", req.getPaymentMethodId());
    // 결제수단과 연결된 빌링키
    PaymentMethod paymentMethod = paymentMethodService.getPaymentMethodForBillingKey(req.getPaymentMethodId());
    log.info("[processingBillingKeyPay] paymentMethodService.getPaymentMethodForBillingKey: {}", paymentMethod);

    CustomerDto customer = new CustomerDto("1","test@gmail.com",new Name("test")); // 테스트 user

    //request Body 설정
    PortOnePaymentRequestDto requestBody = PortOnePaymentRequestDto.builder()
        .billingKey(paymentMethod.getBillingKey())
        .orderName(req.getOrderName())
        .customer(customer)
        .amount(new Amount(req.getAmount()))
        .currency("KRW")
        .productType("DIGITAL")
        .build();

    LocalDateTime tryAt = LocalDateTime.now();
    log.info("[processingBillingKeyPay] requestBody: {}", requestBody);

    // 결제 요청
    PortOneBillingResponseDto response = portOneClient.processingBillingKeyPay(requestBody);
    log.info("[processingBillingKeyPay] portOneClient.processingBillingKeyPay: {}", response);
    // 구독 내역 active 변경 로직

    Subscription subscription = subscriptionRepository.findById(1L).orElse(null);
    log.info("[processingBillingKeyPay] subscription: {}", subscription);
    String rawDateTime = response.getResponse().get("payment").get("paidAt").asText();

    Instant instant = Instant.parse(rawDateTime);
    LocalDateTime localDateTime = LocalDateTime.ofInstant(instant, ZoneId.of("Asia/Seoul"));
    System.out.println("LocalTime: " + localDateTime);
    // 결제 내역 저장
    Payment payment = Payment.builder()
        .paymentMethod(paymentMethod)
        .subscription(subscription)
        .amount(req.getAmount())
        .paymentStatus(PaymentStatus.PENDING)
        .transactionId(response.getResponse().get("payment").get("pgTxId").asText())
        .failureReason(null)
        .tryAt(tryAt)
        .successAt(localDateTime)
        .build();

    // 결제내역 저장
    Payment savePayment = paymentRepository.save(payment);
    log.info("[processingBillingKeyPay] savePayment: {}", savePayment);

    //정기결제 예약


    BillingKeyPaymentResponseDto res = new BillingKeyPaymentResponseDto(
        savePayment.getPaymentId(),PaymentStatus.SUCCESS,payment.getTryAt(),payment.getSuccessAt(),req.getOrderName(),req.getAmount()
    );

    return res;
  }

  //결제취소(구독취소)

  //정기결제예약
//  private void reservationPayment(){
//
//  }
}
