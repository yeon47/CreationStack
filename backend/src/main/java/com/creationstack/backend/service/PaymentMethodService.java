package com.creationstack.backend.service;

import com.creationstack.backend.config.PortOneClient;

import com.creationstack.backend.domain.payment.PaymentMethod;
import com.creationstack.backend.dto.Payment.DeletePaymentMethodRequestDto;
import com.creationstack.backend.dto.Payment.DeletePaymentMethodResponseDto;
import com.creationstack.backend.dto.Payment.PaymentMethodResponseDto;
import com.creationstack.backend.dto.Payment.SavePaymentMethodRequestDto;
import com.creationstack.backend.dto.Payment.SavePaymentMethodResponseDto;

import com.creationstack.backend.exception.CustomException;
import com.creationstack.backend.repository.PaymentMethodRepository;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.List;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PaymentMethodService {

  private final PaymentMethodRepository paymentMethodRepository;
  private final PortOneClient portOneClient;

  // 1. 결제수단 저장
  @Transactional
  public SavePaymentMethodResponseDto save(SavePaymentMethodRequestDto req) {
    try {
      String billingKey = req.getBillingKey();
      JsonNode card = portOneClient.getBillingKeyInfo(billingKey);

      PaymentMethod paymentMethod = PaymentMethod.builder()
          .userId(1L) // TODO: 실제 userId 할당
          .billingKey(billingKey)
          .cardName(card.get("name").asText())
          .cardBrand(card.get("brand").asText())
          .cardNumber(card.get("number").asText())
          .cardType(card.get("type").asText())
          .build();

      paymentMethodRepository.save(paymentMethod);
      SavePaymentMethodResponseDto res = new SavePaymentMethodResponseDto(
          "test", paymentMethod.getCardBrand(), paymentMethod.getCardType(),
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
            paymentMethod.getCardBrand(),
            paymentMethod.getCardType(),
            paymentMethod.getCardNumber(),
            paymentMethod.getCardName()
        )).toList();
  }

  // 3. 빌링키 이용해 결제수단 삭제
  @Transactional
  public DeletePaymentMethodResponseDto deletePaymentMethod(DeletePaymentMethodRequestDto req) {
    try {
      String billingKey = req.getBillingKey();
      if(paymentMethodRepository.deletePaymentMethodByBillingKey(billingKey)){
        JsonNode body = portOneClient.deleteBillingKey(req);
        String deletedAt = body.path("deletedAt").asText();

        DeletePaymentMethodResponseDto res = new DeletePaymentMethodResponseDto(deletedAt,
            req.getReason());
        return res;
      }else{
        throw new CustomException(HttpStatus.BAD_REQUEST,"paymentmethod 삭제 실패");
      }

    } catch (RuntimeException e) {
      throw new RuntimeException("결제수단 삭제 실패");
    }
  }
}



