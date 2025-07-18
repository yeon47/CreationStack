package com.creationstack.backend.etc;

import com.creationstack.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Component;

// 정기결제 스케줄러 현재는 결제 안됨
@Component
@RequiredArgsConstructor
@EnableScheduling
@Slf4j
public class SubscriptionScheduler {
  private final PaymentService paymentService;

  // 매일 00:00에 실행
//  @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
//  @Scheduled(cron = "0 */1 * * * *", zone = "Asia/Seoul") 테스트용. 1분마다 결제 진행
  public void processDailyScheduledPayments() {
    log.info("[Scheduler] 매일 자정 구독 결제 처리 시작");
    paymentService.processAutoBilling();
  }
}