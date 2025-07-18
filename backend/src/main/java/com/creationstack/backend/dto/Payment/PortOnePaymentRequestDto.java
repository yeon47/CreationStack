package com.creationstack.backend.dto.Payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// portone한테 결제 요청 시 사용되는 dto
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PortOnePaymentRequestDto {
  private String storeId;
  private String billingKey; //빌링키(카드)
  private String orderName; //크리에이터닉네임 멤버십 정기 구독권
  private CustomerDto customer; //구매 사용자 정보(아이디, 이름, 이메일)
  private Amount amount; //가격
  private String currency;
  private String productType;

  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  public static class Amount {
    private int total;

    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }
  }
}

