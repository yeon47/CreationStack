package com.creationstack.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.creationstack.backend.domain.subscription.Subscription;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long>{
    Optional<Subscription> findBySubscriberIdAndCreatorId(Long subscriberId, Long creatorId);
}
