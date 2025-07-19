package com.creationstack.backend.service;

import com.creationstack.backend.config.PortOneClient;

import com.creationstack.backend.domain.payment.Payment;
import com.creationstack.backend.domain.payment.PaymentMethod;

import com.creationstack.backend.domain.payment.PaymentStatus;
import com.creationstack.backend.domain.subscription.Subscription;
import com.creationstack.backend.domain.user.User;
import com.creationstack.backend.domain.user.UserDetail;
import com.creationstack.backend.dto.Payment.AmountDto;
import com.creationstack.backend.dto.Payment.BillingKeyPaymentRequestDto;
import com.creationstack.backend.dto.Payment.BillingKeyPaymentResponseDto;
import com.creationstack.backend.dto.Payment.CustomerDto;
import com.creationstack.backend.dto.Payment.CustomerDto.Name;
import com.creationstack.backend.dto.Payment.PortOneBillingResponseDto;
import com.creationstack.backend.dto.Payment.PortOnePaymentRequestDto;

import com.creationstack.backend.dto.Payment.PortOneReservationRequestDto;
import com.creationstack.backend.dto.Payment.PortOneReservationResponseDto;
import com.creationstack.backend.repository.PaymentRepository;
import com.creationstack.backend.repository.UserDetailRepository;
import com.creationstack.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

  private final PaymentRepository paymentRepository;
  private final PaymentMethodService paymentMethodService;
  private final PortOneClient portOneClient;
  private final UserRepository userRepository;
  private final UserDetailRepository userDetailRepository;

  // 구독 요청 시 결제 진행
  public BillingKeyPaymentResponseDto processingBillingKeyPay(BillingKeyPaymentRequestDto req) {


    // 결제수단과 연결된 빌링키
    PaymentMethod paymentMethod = paymentMethodService.getPaymentMethodForBillingKey(req.getPaymentMethodId());
    log.info("[processingBillingKeyPay] paymentMethodService.getPaymentMethodForBillingKey: {}", paymentMethod);

    // 구매하는
//    CustomerDto customer = new CustomerDto("1","test@gmail.com",new Name("test")); // 테스트 user

    // 구매하는 사용자 정보 가져와 구매자 객체 생성
    Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    UserDetail userDetail = userDetailRepository.findById(userId).orElse(null);
    CustomerDto customer = new CustomerDto(userId+"",userDetail.getEmail(),new Name(userDetail.getUsername()));

    //request Body 설정
    PortOnePaymentRequestDto requestBody = PortOnePaymentRequestDto.builder()
        .billingKey(paymentMethod.getBillingKey())
        .orderName(req.getOrderName())
        .customer(customer)
        .amount(new AmountDto(req.getAmount()))
        .currency("KRW")
        .productType("DIGITAL")
        .build();

    LocalDateTime tryAt = LocalDateTime.now();
    log.info("[processingBillingKeyPay] requestBody: {}", requestBody);

    // 결제 요청
    PortOneBillingResponseDto response = portOneClient.processingBillingKeyPay(requestBody);
    log.info("[processingBillingKeyPay] portOneClient.processingBillingKeyPay: {}", response);
    // 구독 내역 active 변경 로직
//    subscriptionService.activateSubscription(response.);

//    Subscription subscription = subscriptionRepository.findById(1L).orElse(null);
//    log.info("[processingBillingKeyPay] subscription: {}", subscription);
//    String rawDateTime = response.getResponse().get("payment").get("paidAt").asText();
//
//    Instant instant = Instant.parse(rawDateTime);
//    LocalDateTime localDateTime = LocalDateTime.ofInstant(instant, ZoneId.of("Asia/Seoul"));
//    System.out.println("LocalTime: " + localDateTime);
//    // 결제 내역 저장
//    Payment payment = Payment.builder()
//        .paymentMethod(paymentMethod)
//        .subscription(subscription)
//        .amount(req.getAmount())
//        .paymentStatus(PaymentStatus.PENDING)
//        .transactionId(response.getResponse().get("payment").get("pgTxId").asText())
//        .failureReason(null)
//        .tryAt(tryAt)
//        .successAt(localDateTime)
//        .build();
//
//    // 결제내역 저장
//    Payment savePayment = paymentRepository.save(payment);
//    log.info("[processingBillingKeyPay] savePayment: {}", savePayment);
//
//    //정기결제 예약
//
//
//    BillingKeyPaymentResponseDto res = new BillingKeyPaymentResponseDto(
//        savePayment.getPaymentId(),PaymentStatus.SUCCESS,payment.getTryAt(),payment.getSuccessAt(),req.getOrderName(),req.getAmount()
//    );

    return null;
  }

  //결제취소(구독취소)

  //정기결제자동실행
  @Transactional
  public void processAutoBilling() {
//    LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
//    LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);
//    List<Subscription> todaySubscriptions = subscriptionRepository.findByNextPaymentAtBetween(startOfDay,endOfDay);
//
//    for (Subscription subscription : todaySubscriptions) {
//      log.info("[AutoBilling] 결제 대상 구독 ID: {}", subscription.getSubscriptionId());
//
//      try {
//        // 1. 결제 정보 구성
//        PaymentMethod paymentMethod = subscription.getPaymentMethod();
//        PortOnePaymentRequestDto requestDto = PortOnePaymentRequestDto.builder()
//            .billingKey(paymentMethod.getBillingKey())
//            .orderName(startOfDay.getDayOfMonth()+"월 정기 결제") // 추후 변경
//            .customer(new CustomerDto(
//                String.valueOf(subscription.getSubscriberId()),
//                "test@gmail.com", // 이메일 필요 시 DB에서 받아오세요
//                new Name("test")))
//            .amount(new AmountDto(4900))
//            .currency("KRW")
//            .productType("DIGITAL")
//            .build();
//        log.info("[AutoBilling] 결제 대상 구독 : {}", requestDto);
//        // 2. 결제 요청
//        PortOneBillingResponseDto response = portOneClient.processingBillingKeyPay(requestDto);
//
//        String rawDateTime = response.getResponse().get("payment").get("paidAt").asText();
//
//      Instant instant = Instant.parse(rawDateTime);
//      LocalDateTime localDateTime = LocalDateTime.ofInstant(instant, ZoneId.of("Asia/Seoul"));
//        log.info("[AutoBilling] 결제 대상 구독 결과 : {}", response);
//        // 3. 결제 내역 저장
//        Payment payment = Payment.builder()
//            .paymentMethod(paymentMethod)
//            .subscription(subscription)
//            .amount(4900)
//            .paymentStatus(PaymentStatus.SUCCESS)
//            .transactionId(response.getResponse().get("payment").get("pgTxId").asText())
//            .tryAt(LocalDateTime.now())
//            .successAt(localDateTime)
//            .failureReason(null)
//            .build();
//
//        paymentRepository.save(payment);
//        log.info("[AutoBilling] 결제내역저장 : {}", payment);
//        // 4. 성공 시 구독 갱신
//        subscription.setLastPaymentAt(LocalDateTime.now());
//        subscription.setNextPaymentAt(subscription.getNextPaymentAt().plusMonths(1));
//        subscriptionRepository.save(subscription);
//        log.info("[AutoBilling] 구독내역업데이트완료 ");
//
//      } catch (Exception e) {
//        log.error("[AutoBilling] 예외 발생: {}", e.getMessage(), e);
//      }
  }
}
