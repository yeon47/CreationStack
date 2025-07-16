package com.creationstack.backend.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DeletePaymentMethodResponseDto {
  private String deletedAt;
  private String message;
}
