package com.creationstack.backend.repository;

import com.creationstack.backend.domain.PaymentMethod;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
  List<PaymentMethod> findAllByUserId(Long userId);
  boolean deletePaymentMethodByBillingKey(String billingKey);
}
