package com.creationstack.backend.config;

import com.creationstack.backend.dto.Payment.PortOneBillingResponseDto;
import com.creationstack.backend.dto.Payment.PortOnePaymentRequestDto;
import com.creationstack.backend.dto.Payment.DeletePaymentMethodRequestDto;
import com.creationstack.backend.exception.CustomException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;

@Component
@RequiredArgsConstructor
@Slf4j
public class PortOneClient {

  private final RestTemplate restTemplate = new RestTemplate();
  private final ObjectMapper objectMapper = new ObjectMapper();

  @Value("${portone.apisecret}")
  private String API_SECRET;

  @Value("${portone.hostname}")
  private String API_HOSTNAME;

  @Value("${portone.storeid}")
  private String storeId;

  // billingkey에 등록된 카드 정보 요청
  public JsonNode getBillingKeyInfo(String billingKey) {
    String requestUrl = API_HOSTNAME + "/billing-keys/" + billingKey;
    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "PortOne " + API_SECRET);
    headers.setContentType(MediaType.APPLICATION_JSON);

    HttpEntity<Void> entity = new HttpEntity<>(headers);

    ResponseEntity<String> response =
        restTemplate.exchange(requestUrl, HttpMethod.GET, entity, String.class);

    try {
      JsonNode root = objectMapper.readTree(response.getBody());
      JsonNode methods = root.get("methods");
      return methods.get(0).get("card");
    } catch (Exception e) {
      throw new RuntimeException("포트원 응답 파싱 실패" + e);
    }
  }


  //카드 이용한 결제 진행
  public PortOneBillingResponseDto processingBillingKeyPay(PortOnePaymentRequestDto requestBody) {
    String portOnePaymentId = generateWithTimestamp();
    String requestUrl = API_HOSTNAME + "/payments/" + portOnePaymentId + "/billing-key";
    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "PortOne " + API_SECRET);
    headers.setContentType(MediaType.APPLICATION_JSON);
    log.info("[PortOneClient] requestBody:{}", requestBody.getBillingKey());
    requestBody.setStoreId(storeId);
    HttpEntity<PortOnePaymentRequestDto> entity = new HttpEntity<>(requestBody, headers);
     log.info("[PortOneClient] entity:{}", entity);

    ResponseEntity<String> response =
        restTemplate.exchange(requestUrl, HttpMethod.POST, entity, String.class);

    log.info("[PortOneClient] response:{}", response);
    try {
      return PortOneBillingResponseDto.builder().portOnePaymentId(portOnePaymentId)
          .response(objectMapper.readTree(response.getBody())).build();
    } catch (Exception e) {
      throw new CustomException(HttpStatus.BAD_REQUEST, e.getMessage());
    }
  }

  // 결제 예약 취소

  // 결제 예약

  //

  public JsonNode deleteBillingKey(DeletePaymentMethodRequestDto req) {
    String requestUrl =
        API_HOSTNAME + "/billing-keys/" + req.getBillingKey() + "?reason=" + req.getReason();

    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "PortOne " + API_SECRET);
    headers.setContentType(MediaType.APPLICATION_JSON);

    HttpEntity<Void> entity = new HttpEntity<>(headers);

    ResponseEntity<String> response =
        restTemplate.exchange(requestUrl, HttpMethod.DELETE, entity, String.class);

    try {
      return objectMapper.readTree(response.getBody());
    } catch (Exception e) {
      throw new RuntimeException("포트원 응답 파싱 실패" + e);
    }
  }

  private String generateWithTimestamp() {
    String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
    String random = UUID.randomUUID().toString().substring(0, 6);
    return "order" + time + "_" + random;
  }
}
