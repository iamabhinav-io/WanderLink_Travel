package com.wanderlink.guide;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.wanderlink.common.exception.ResourceNotFoundException;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class GuideService {

    private final GuideRepository guideRepository;

    public GuideService(GuideRepository guideRepository) {
        this.guideRepository = guideRepository;
    }

    public List<Guide> getAllGuides() {
        List<Guide> guides = guideRepository.findAll();
        // If DB is empty, seed in-memory defaults for hackathon demo
        if (guides.isEmpty()) {
            return getDefaultGuides();
        }
        return guides;
    }

    public Guide getGuideById(Long id) {
        return guideRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guide", "id", id));
    }

    @Transactional
    public Guide saveGuide(Guide guide) {
        return guideRepository.save(guide);
    }

    /**
     * Default guides returned when DB table is empty.
     * Covers all 4 hackathon showcase destinations.
     */
    private List<Guide> getDefaultGuides() {
        Guide g1 = new Guide("Ravi Kamat", "Goa",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
                "English,Hindi,Konkani", "10+ Years Experience", 10, 1800.0,
                "Heritage Walks,Beach Tours,Local Food",
                "Born-and-raised Goan guide specializing in hidden beach trails, heritage Fontainhas walks, and spice plantation tours.",
                "+91 94230 12345");

        Guide g2 = new Guide("Pradeep Thakur", "Manali",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
                "English,Hindi,Himachali", "8+ Years Experience", 8, 2200.0,
                "Trekking,Snow Activities,Mountain Culture",
                "Expert Himalayan trekker guiding trails in Solang Valley, Rohtang Pass, and high-altitude Hampta Pass.",
                "+91 98760 55543");

        Guide g3 = new Guide("Anoop Pillai", "Kerala",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
                "English,Malayalam,Tamil", "12+ Years Experience", 12, 1600.0,
                "Backwaters,Ayurveda,Spice Trails",
                "Kerala-born guide offering immersive backwater journeys, Ayurveda wellness experiences, and spice estate tours in Munnar.",
                "+91 94470 88812");

        Guide g4 = new Guide("Deepak Sharma", "Jaipur",
                "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80",
                "English,Hindi,French", "15+ Years Experience", 15, 2000.0,
                "Heritage Forts,Royal Culture,Photography Tours",
                "Certified Rajasthan heritage guide specializing in Amber Fort, Hawa Mahal, and curated photography walks through the Pink City.",
                "+91 98290 34561");

        return Arrays.asList(g1, g2, g3, g4);
    }
}
