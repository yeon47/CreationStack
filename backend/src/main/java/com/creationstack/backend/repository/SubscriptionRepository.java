package com.creationstack.backend.repository;

import com.creationstack.backend.domain.payment.PaymentMethod;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.creationstack.backend.domain.subscription.Subscription;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long>{
    Optional<Subscription> findBySubscriberIdAndCreatorId(Long subscriberId, Long creatorId);
    List<Subscription> findByPaymentMethod(PaymentMethod paymentMethod);
    List<Subscription> findAllByNextPaymentAtBefore(LocalDateTime time);

    @Modifying
    @Query("DELETE FROM Subscription s WHERE s.status.name IN ('EXPIRED') AND s.nextPaymentAt <= :threshold")
    void deleteOldExpiredSubscriptions(@Param("threshold") LocalDateTime threshold);
}
