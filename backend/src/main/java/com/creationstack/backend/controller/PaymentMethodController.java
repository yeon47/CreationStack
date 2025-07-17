package com.creationstack.backend.controller;

import com.creationstack.backend.dto.Payment.DeletePaymentMethodRequestDto;
import com.creationstack.backend.dto.Payment.DeletePaymentMethodResponseDto;
import com.creationstack.backend.dto.Payment.PaymentMethodResponseDto;
import com.creationstack.backend.dto.Payment.SavePaymentMethodRequestDto;
import com.creationstack.backend.dto.Payment.SavePaymentMethodResponseDto;
import com.creationstack.backend.service.PaymentMethodService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class PaymentMethodController {
  private final PaymentMethodService paymentMethodService;

  // 1. 카드 등록(결제수단 추가 버튼 선택)
  @PostMapping("/api/billings/card")
  public ResponseEntity<SavePaymentMethodResponseDto> savePaymentMethod(@RequestBody SavePaymentMethodRequestDto req){
    return ResponseEntity.ok(paymentMethodService.save(req));
  }

  // 2. 사용자의 모든 결제 수단 조회
  @GetMapping("/api/payments")
  public ResponseEntity<List<PaymentMethodResponseDto>> getAllPaymentMethods(){
    return ResponseEntity.ok(paymentMethodService.getPaymentMethod(1L));
  }

  // 3. 결제 수단 삭제
  @DeleteMapping("/api/billings/keys")
  public ResponseEntity<DeletePaymentMethodResponseDto> deletePaymentMethod(@RequestBody DeletePaymentMethodRequestDto req){
    return ResponseEntity.ok(paymentMethodService.deletePaymentMethod(req));
  }
}
