package com.creationstack.backend.dto.Payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PaymentMethodResponseDto {
  private String cardBrand;
  private String cardType;
  private String cardNumber;
  private String cardName;
}
