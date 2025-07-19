package com.creationstack.backend.etc;

import com.creationstack.backend.service.SubscriptionBillingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

// 정기결제 스케줄러 현재는 결제 안됨
@Component
@RequiredArgsConstructor
@EnableScheduling
@Slf4j
public class SubscriptionScheduler {
  private final SubscriptionBillingService subscriptionBillingService;

  // 매일 00:00에 실행
//  @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
//  @Scheduled(cron = "0 */1 * * * *", zone = "Asia/Seoul") 테스트용. 1분마다 결제 진행
  public void run(){
    subscriptionBillingService.handleDueSubscriptions();
  }
}