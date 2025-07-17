package com.creationstack.backend.dto.Payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SavePaymentMethodResponseDto {
  private String username;
  private String cardBrand;
  private String cardType;
  private String cardName;
  private String cardNumber;
}
