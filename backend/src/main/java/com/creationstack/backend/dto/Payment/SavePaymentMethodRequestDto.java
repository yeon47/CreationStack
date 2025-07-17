package com.creationstack.backend.dto.Payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SavePaymentMethodRequestDto {
  private String billingKey;
}
