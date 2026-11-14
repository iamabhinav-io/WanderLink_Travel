package com.wanderlink.accommodation;

import com.wanderlink.user.User;
import com.wanderlink.user.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AccommodationService {

    private final AccommodationRepository accommodationRepository;
    private final UserService userService;

    public AccommodationService(AccommodationRepository accommodationRepository, UserService userService) {
        this.accommodationRepository = accommodationRepository;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<AccommodationDTO.Response> getAllAccommodations() {
        return accommodationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AccommodationDTO.Response addAccommodation(AccommodationDTO.CreateRequest request) {
        User host = userService.findEntityById(request.getHostId());

        Accommodation accommodation = new Accommodation(
                host,
                request.getTitle().trim(),
                request.getLocation().trim(),
                request.getDescription() != null ? request.getDescription().trim() : "",
                request.getPricePerNight(),
                request.getImageUrl() != null ? request.getImageUrl().trim() : ""
        );

        Accommodation saved = accommodationRepository.save(accommodation);
        return mapToResponse(saved);
    }

    public AccommodationDTO.Response mapToResponse(Accommodation accommodation) {
        User host = accommodation.getHost();
        return new AccommodationDTO.Response(
                accommodation.getId(),
                host.getId(),
                host.getName(),
                accommodation.getTitle(),
                accommodation.getLocation(),
                accommodation.getDescription(),
                accommodation.getPricePerNight(),
                accommodation.getImageUrl()
        );
    }
}
