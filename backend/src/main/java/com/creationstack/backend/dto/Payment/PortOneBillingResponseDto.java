package com.creationstack.backend.dto.Payment;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PortOneBillingResponseDto {
  private String portOnePaymentId;
  private JsonNode response;
}
