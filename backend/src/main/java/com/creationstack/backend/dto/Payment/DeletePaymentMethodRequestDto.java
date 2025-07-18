package com.creationstack.backend.dto.Payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeletePaymentMethodRequestDto {
  private String billingKey;
  private String reason;
}
