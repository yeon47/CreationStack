package com.creationstack.backend.dto.Subscription;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
public class SubscriptionCountResponseDto {
    private Long userId;
    private Long subsCount;
    private Long newSubsCount;

    public SubscriptionCountResponseDto(Long userId, Number subsCount, Number newSubsCount) {
        this.userId = userId;
        this.subsCount = subsCount != null ? subsCount.longValue() : 0L;
        this.newSubsCount = newSubsCount != null ? newSubsCount.longValue() : 0L;
    }
}
