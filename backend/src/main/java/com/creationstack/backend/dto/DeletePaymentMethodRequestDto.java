package com.creationstack.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DeletePaymentMethodRequestDto {
  private String billingKey;
  private String reason;
}
