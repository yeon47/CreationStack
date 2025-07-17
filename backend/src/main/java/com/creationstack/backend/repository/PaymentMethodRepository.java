package com.creationstack.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.creationstack.backend.domain.payment.PaymentMethod;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
  List<PaymentMethod> findAllByUserId(Long userId);
  boolean deletePaymentMethodByBillingKey(String billingKey);
}
