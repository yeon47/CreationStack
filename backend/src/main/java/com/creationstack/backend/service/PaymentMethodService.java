package com.creationstack.backend.service;

import com.creationstack.backend.config.PortOneClient;

import com.creationstack.backend.domain.payment.Payment;
import com.creationstack.backend.domain.payment.PaymentMethod;
import com.creationstack.backend.domain.subscription.Subscription;
import com.creationstack.backend.domain.user.UserDetail;
import com.creationstack.backend.dto.Payment.DeletePaymentMethodRequestDto;
import com.creationstack.backend.dto.Payment.DeletePaymentMethodResponseDto;
import com.creationstack.backend.dto.Payment.PaymentMethodResponseDto;
import com.creationstack.backend.dto.Payment.SavePaymentMethodRequestDto;
import com.creationstack.backend.dto.Payment.SavePaymentMethodResponseDto;

import com.creationstack.backend.exception.CustomException;
import com.creationstack.backend.repository.PaymentMethodRepository;
import com.creationstack.backend.repository.PaymentRepository;
import com.creationstack.backend.repository.SubscriptionRepository;
import com.creationstack.backend.repository.UserDetailRepository;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.List;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentMethodService {

  private final PaymentMethodRepository paymentMethodRepository;
  private final PortOneClient portOneClient;
  private final SubscriptionRepository subscriptionRepository;
  private final PaymentRepository paymentRepository;
  private final UserDetailRepository userDetailRepository;

  // 1. 결제수단 저장
  @Transactional
  public SavePaymentMethodResponseDto save(Long userId, SavePaymentMethodRequestDto req) {
    try {
      String billingKey = req.getBillingKey();
      JsonNode card = portOneClient.getBillingKeyInfo(billingKey);

      UserDetail userDetail = userDetailRepository.findById(userId).orElse(null);

      PaymentMethod paymentMethod = PaymentMethod.builder()
          .userId(userId) // TODO: 실제 userId 할당
          .billingKey(billingKey)
          .cardName(card.get("name").asText())
          .cardBrand(card.get("brand").asText())
          .cardNumber(card.get("number").asText())
          .cardType(card.get("type").asText())
          .build();

      paymentMethodRepository.save(paymentMethod);
      assert userDetail != null;
      SavePaymentMethodResponseDto res = new SavePaymentMethodResponseDto(
          userDetail.getUsername(), paymentMethod.getCardBrand(), paymentMethod.getCardType(),
          paymentMethod.getCardName(), paymentMethod.getCardNumber()
      );
      return res;
    } catch (RuntimeException e) {
      throw new RuntimeException("결제수단 저장 실패");
    }
  }

  // 2. 회원 ID 통해 저장된 결제수단 호출
  public List<PaymentMethodResponseDto> getPaymentMethod(Long userId) {
    return paymentMethodRepository.findAllByUserId(userId).stream()
        .map(paymentMethod -> new PaymentMethodResponseDto(
            paymentMethod.getPaymentMethodId(), // DB에 저장된 결제수단 고유ID
            paymentMethod.getCardBrand(), // MASTER | VISA
            paymentMethod.getCardType(), //CREDIT | DEBIT
            paymentMethod.getCardNumber(), // 0000-0000-****-**00
            paymentMethod.getCardName() //신한은행, 국민은행
        )).toList();
  }

  // 3. 빌링키 이용해 결제수단 삭제(결제수단 단독 삭제)
  @Transactional
  public DeletePaymentMethodResponseDto deletePaymentMethod(DeletePaymentMethodRequestDto req) {
    Long paymentMethodId = req.getPaymentMethodId();

    // 카드 있는지 조회
    PaymentMethod paymentMethod = paymentMethodRepository.findById(paymentMethodId).orElse(null);
    if(paymentMethod == null) {
      throw new CustomException(HttpStatus.BAD_REQUEST, "조회되는 결제수단이 없습니다.");
    }
    log.info("[PaymentMethodService]  deletePaymentMethod paymentMethod 정보:{}",paymentMethod.getCardName());

    detachPaymentMethodFromRelations(paymentMethod);

    // 빌링키 이용한 포트원 삭제 API 호출
    JsonNode responseBody = portOneClient.deleteBillingKey(req,paymentMethod.getBillingKey());
    log.info("[PaymentMethodService]  deletePaymentMethod responseBody:{}",responseBody.get("deletedAt").asText());

    DeletePaymentMethodResponseDto res = DeletePaymentMethodResponseDto.builder()
        .paymentMethodId(req.getPaymentMethodId()) // 삭제된 paymentmethod의 id
        .deletedAt(responseBody.get("deletedAt").asText()) // 삭제 시각
        .message(req.getReason() == null ? "결제수단이 삭제되었습니다." : req.getReason()) // message
        .build();

    // DB에서 결제수단 삭제 (삭제 안되면 portoneclient 클래스에서 exception 처리)
    int deletedCount = paymentMethodRepository.deletePaymentMethodByPaymentMethodId(paymentMethodId);
    if(deletedCount == 0){
      throw new CustomException(HttpStatus.BAD_REQUEST,"결제수단 삭제 실패");
    }
    log.info("[PaymentMethodService]  deletePaymentMethod 삭제완료:{}",paymentMethodId);

    return res;
  }

  // 4. paymentMethodId 이용한 결제수단 조회
  public PaymentMethod getPaymentMethodForBillingKey(Long paymentMethodId) {
    return paymentMethodRepository.findById(paymentMethodId).orElse(null);
  }

  private void detachPaymentMethodFromRelations(PaymentMethod paymentMethod) {
    // Subscription에서 결제수단 제거
    List<Subscription> subscriptions = subscriptionRepository.findByPaymentMethod(paymentMethod);
    boolean hasActiveSubscription = subscriptions.stream()
        .anyMatch(subscription ->
            subscription.getStatus() != null &&
                "ACTIVE".equalsIgnoreCase(subscription.getStatus().getName())
        );

    // 활성화된 구독이 연결되어 있으면 결제할 수 없게 함
    if (hasActiveSubscription) {
      throw new CustomException(HttpStatus.BAD_REQUEST, "활성화된 구독이 있어 결제수단을 삭제할 수 없습니다.");
    }
    subscriptions.forEach(subscription -> subscription.setPaymentMethod(null));
    subscriptionRepository.saveAll(subscriptions);

    // Payment에서 결제수단 제거
    List<Payment> payments = paymentRepository.findByPaymentMethod(paymentMethod);
    payments.forEach(payment -> payment.setPaymentMethod(null));
    paymentRepository.saveAll(payments);

    log.info("[PaymentMethodService] 연관된 Subscription({})건, Payment({})건에서 결제수단 제거 완료",
        subscriptions.size(), payments.size());
  }
}



