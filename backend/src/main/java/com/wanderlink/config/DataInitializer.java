package com.wanderlink.config;

import com.wanderlink.accommodation.Accommodation;
import com.wanderlink.accommodation.AccommodationRepository;
import com.wanderlink.connection.Connection;
import com.wanderlink.connection.ConnectionRepository;
import com.wanderlink.food.FoodListing;
import com.wanderlink.food.FoodRepository;
import com.wanderlink.group.GroupMember;
import com.wanderlink.group.GroupMemberRepository;
import com.wanderlink.group.TravelGroup;
import com.wanderlink.group.GroupRepository;
import com.wanderlink.trip.Trip;
import com.wanderlink.trip.TripRepository;
import com.wanderlink.user.User;
import com.wanderlink.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

/**
 * Seeds predictable demo data for WanderLink hackathon showcase.
 * Covers Goa, Manali, Kerala, and Jaipur per project specifications.
 * Skips seeding if data already exists to prevent duplicates on restart.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final ConnectionRepository connectionRepository;
    private final AccommodationRepository accommodationRepository;
    private final FoodRepository foodRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${wanderlink.data.seed:true}")
    private boolean seedEnabled;

    public DataInitializer(UserRepository userRepository,
                           TripRepository tripRepository,
                           ConnectionRepository connectionRepository,
                           AccommodationRepository accommodationRepository,
                           FoodRepository foodRepository,
                           GroupRepository groupRepository,
                           GroupMemberRepository groupMemberRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tripRepository = tripRepository;
        this.connectionRepository = connectionRepository;
        this.accommodationRepository = accommodationRepository;
        this.foodRepository = foodRepository;
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedEnabled) {
            log.info("Sample data seeding disabled via configuration.");
            return;
        }
        if (userRepository.count() > 0) {
            log.info("Database already seeded ({} users found). Skipping.", userRepository.count());
            return;
        }

        log.info("Seeding WanderLink demo data...");
        String pw = passwordEncoder.encode("password123");

        // ── USERS ────────────────────────────────────────────────────────────────
        // name, email, passwordHash, age, profileImage, location, bio, interests, preferredTravelStyle, role
        User u1 = new User("Aarav Sharma", "aarav.sharma@example.com", pw, 26,
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
                "Mumbai", "Solo backpacker, photographer and beach lover.",
                "Beach,Adventure,Photography", "Budget", "USER");

        User u2 = new User("Priya Patel", "priya.patel@example.com", pw, 24,
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
                "Pune", "Amateur photographer and adventure seeker excited to explore Goa coast.",
                "Beach,Adventure,Photography,Food", "Budget", "USER");

        User u3 = new User("Rohan Gupta", "rohan.gupta@example.com", pw, 28,
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
                "Delhi", "Culture enthusiast looking for chill beach vibes and café hopping.",
                "Beach,Food,Music", "Moderate", "USER");

        User u4 = new User("Ananya Iyer", "ananya.iyer@example.com", pw, 25,
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
                "Bengaluru", "Local host and homestay owner in South Goa. Passionate about heritage.",
                "Yoga,Nature,Food", "Luxury", "HOST");

        User u5 = new User("Vikram Singh", "vikram.singh@example.com", pw, 30,
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
                "Jaipur", "History buff, road tripper and culinary storyteller.",
                "Adventure,Trekking,Culinary", "Adventure", "PROVIDER");

        User u6 = new User("Neha Desai", "neha.desai@example.com", pw, 27,
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
                "Ahmedabad", "Mountain hiker and café explorer.",
                "Hiking,Mountains,Photography", "Budget", "USER");

        // Kerala traveler
        User u7 = new User("Meera Nair", "meera.nair@example.com", pw, 29,
                "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=400&q=80",
                "Kochi", "Backwaters lover, yoga practitioner and spice trail explorer.",
                "Nature,Yoga,Food,Culture", "Budget", "USER");

        // Jaipur traveler
        User u8 = new User("Arjun Rajput", "arjun.rajput@example.com", pw, 32,
                "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80",
                "Jaipur", "Heritage walk enthusiast and Rajasthani cuisine aficionado.",
                "History,Culture,Food,Photography", "Moderate", "USER");

        List<User> savedUsers = userRepository.saveAll(Arrays.asList(u1, u2, u3, u4, u5, u6, u7, u8));
        u1 = savedUsers.get(0); u2 = savedUsers.get(1); u3 = savedUsers.get(2); u4 = savedUsers.get(3);
        u5 = savedUsers.get(4); u6 = savedUsers.get(5); u7 = savedUsers.get(6); u8 = savedUsers.get(7);
        log.info("Created {} sample users.", savedUsers.size());

        // ── TRIPS ────────────────────────────────────────────────────────────────
        Trip t1 = new Trip(u1, "Goa", LocalDate.of(2026, 12, 20), LocalDate.of(2026, 12, 25), 10000.0,
                "Beach,Adventure,Photography", "Budget",
                "Solo backpacker exploring North & South Goa beaches with photography stops.");

        Trip t2 = new Trip(u2, "Goa", LocalDate.of(2026, 12, 21), LocalDate.of(2026, 12, 25), 11000.0,
                "Beach,Adventure,Photography,Food", "Budget",
                "Scenic photography retreat along Goa beaches with sunset sessions.");

        Trip t3 = new Trip(u3, "Goa", LocalDate.of(2026, 12, 19), LocalDate.of(2026, 12, 24), 18000.0,
                "Beach,Food,Music", "Moderate",
                "Chill vacation exploring cafés, live music, and sunsets in Vagator.");

        Trip t4 = new Trip(u4, "Goa", LocalDate.of(2026, 12, 23), LocalDate.of(2026, 12, 28), 35000.0,
                "Yoga,Nature,Food", "Luxury",
                "Wellness and heritage architecture appreciation trip.");

        Trip t5 = new Trip(u5, "Goa", LocalDate.of(2026, 12, 28), LocalDate.of(2027, 1, 2), 12000.0,
                "Adventure,Trekking", "Adventure",
                "New Year exploration of Dudhsagar waterfalls and spice farms.");

        Trip t6 = new Trip(u6, "Manali", LocalDate.of(2026, 12, 20), LocalDate.of(2026, 12, 25), 15000.0,
                "Hiking,Mountains,Photography", "Budget",
                "Snow trail trekking in Solang Valley and Rohtang Pass.");

        Trip t7 = new Trip(u7, "Kerala", LocalDate.of(2026, 12, 22), LocalDate.of(2026, 12, 28), 13000.0,
                "Nature,Yoga,Food,Culture", "Budget",
                "Backwaters houseboat journey through Alleppey and Munnar tea trails.");

        Trip t8 = new Trip(u8, "Jaipur", LocalDate.of(2026, 12, 20), LocalDate.of(2026, 12, 24), 16000.0,
                "History,Culture,Food,Photography", "Moderate",
                "Royal heritage walks through Amber Fort, Hawa Mahal and local bazaars.");

        tripRepository.saveAll(Arrays.asList(t1, t2, t3, t4, t5, t6, t7, t8));
        log.info("Created 8 sample trips.");

        // ── CONNECTIONS ──────────────────────────────────────────────────────────
        connectionRepository.save(new Connection(u1, u2));
        log.info("Created 1 pending connection (Aarav → Priya).");

        // ── ACCOMMODATIONS ───────────────────────────────────────────────────────
        // Goa
        Accommodation a1 = new Accommodation(u4,
                "Cozy Coconut Grove Villa near Palolem",
                "Palolem, South Goa",
                "Quiet, authentic Portuguese-style heritage cottage surrounded by palm trees, 5 minutes walk from Palolem beach.",
                1800.0, "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80");

        Accommodation a2 = new Accommodation(u4,
                "Backpacker Haven & Garden Studio",
                "Anjuna, North Goa",
                "Vibrant garden studio with co-working desks, fiber internet, and shared rooftop terrace for travelers.",
                950.0, "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80");

        Accommodation a3 = new Accommodation(u1,
                "Cliffside Sunset Eco-Cottage",
                "Vagator, North Goa",
                "Eco-friendly wooden cottage overlooking Ozran beach cliffs. Perfect for digital nomads and sunset lovers.",
                2200.0, "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80");

        // Manali
        Accommodation a4 = new Accommodation(u6,
                "Himalayan Wood-Cabin Retreat",
                "Old Manali, Himachal Pradesh",
                "Traditional cedar wood cabin with mountain views, bonfire area, and home-cooked Himachali meals.",
                2800.0, "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80");

        // Kerala
        Accommodation a5 = new Accommodation(u7,
                "Backwaters Houseboat & Heritage Stay",
                "Alleppey, Kerala",
                "Traditional Kerala teak houseboat cruising through scenic Alleppey canals with organic breakfast.",
                3500.0, "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80");

        // Jaipur
        Accommodation a6 = new Accommodation(u8,
                "Heritage Haveli Boutique Stay",
                "Old City, Jaipur, Rajasthan",
                "Restored 18th-century Rajput haveli with intricate frescoes, rooftop dining, and royal hospitality.",
                4200.0, "https://images.unsplash.com/photo-1587295656906-b1ff61a24546?auto=format&fit=crop&w=800&q=80");

        accommodationRepository.saveAll(Arrays.asList(a1, a2, a3, a4, a5, a6));
        log.info("Created 6 accommodation listings.");

        // ── FOOD LISTINGS ────────────────────────────────────────────────────────
        // Goa
        FoodListing f1 = new FoodListing(u5,
                "Traditional Goan Fish Thali & Sol Kadhi Feast",
                "Goan Coastal", "Panaji, Goa", 350.0,
                "Authentic homemade Kingfish curry, prawn rawa fry, kismoor, and refreshing sol kadhi.",
                "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80");

        FoodListing f2 = new FoodListing(u5,
                "Home-baked Bebinca & Portuguese Tea Tasting",
                "Goan Portuguese Bakery", "Fontainhas, Panaji, Goa", 200.0,
                "7-layer coconut bebinca served warm with artisanal spiced tea in a historic courtyard.",
                "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80");

        FoodListing f3 = new FoodListing(u2,
                "Sunset Beachside Vegan Kokum Curry & Rice",
                "Konkani Vegan", "Morjim, Goa", 280.0,
                "Zesty homemade coastal curry cooked with fresh coconut milk, kokum, and organic red rice.",
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80");

        // Manali
        FoodListing f4 = new FoodListing(u6,
                "Himachali Siddu & Dham Thali Experience",
                "Himachali Traditional", "Old Manali", 320.0,
                "Authentic Himachali dham feast: rajma, kaddu, boor ki kadi, and freshly steamed siddu.",
                "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80");

        // Kerala
        FoodListing f5 = new FoodListing(u7,
                "Kerala Sadhya Grand Feast on Banana Leaf",
                "Kerala Traditional", "Ernakulam, Kerala", 450.0,
                "Full 26-dish vegetarian sadhya served on plantain leaf with payasam and kalan.",
                "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80");

        // Jaipur
        FoodListing f6 = new FoodListing(u8,
                "Rajasthani Dal Baati Churma Home Feast",
                "Rajasthani Traditional", "Pink City, Jaipur", 380.0,
                "Classic dal baati churma cooked in clay pot with five types of dal, ghee, and churma.",
                "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80");

        foodRepository.saveAll(Arrays.asList(f1, f2, f3, f4, f5, f6));
        log.info("Created 6 food listings.");

        // ── TRAVEL GROUPS ────────────────────────────────────────────────────────
        TravelGroup g1 = new TravelGroup("Goa Sunset & Beach Trail Explorers", "Goa",
                "Solo travelers seeking photography walks, hidden beach discoveries, and sunset music jams.", u1);
        g1.setMemberCount(2);
        TravelGroup sg1 = groupRepository.save(g1);
        groupMemberRepository.save(new GroupMember(sg1, u1));
        groupMemberRepository.save(new GroupMember(sg1, u2));

        TravelGroup g2 = new TravelGroup("Goan Foodie & Heritage Café Hoppers", "Goa",
                "Exploring historic Panaji bakeries, spice plantations, and offbeat coastal shacks.", u3);
        g2.setMemberCount(2);
        TravelGroup sg2 = groupRepository.save(g2);
        groupMemberRepository.save(new GroupMember(sg2, u3));
        groupMemberRepository.save(new GroupMember(sg2, u4));

        TravelGroup g3 = new TravelGroup("Dudhsagar Waterfall Trek & Camp", "Goa",
                "Weekend adventure trek to magnificent Dudhsagar waterfalls on the Goa-Karnataka border.", u5);
        g3.setMemberCount(1);
        TravelGroup sg3 = groupRepository.save(g3);
        groupMemberRepository.save(new GroupMember(sg3, u5));

        TravelGroup g4 = new TravelGroup("Manali Snow Trek & Solang Valley Crew", "Manali",
                "Trekkers heading to Solang Valley, Rohtang Pass, and Hampta Pass winter camps.", u6);
        g4.setMemberCount(1);
        TravelGroup sg4 = groupRepository.save(g4);
        groupMemberRepository.save(new GroupMember(sg4, u6));

        TravelGroup g5 = new TravelGroup("Kerala Backwaters & Spice Trail Wanderers", "Kerala",
                "Slow travelers exploring houseboat canals, Munnar tea estates, and forest trails.", u7);
        g5.setMemberCount(1);
        TravelGroup sg5 = groupRepository.save(g5);
        groupMemberRepository.save(new GroupMember(sg5, u7));

        TravelGroup g6 = new TravelGroup("Jaipur Heritage Walks & Pink City Explorers", "Jaipur",
                "History lovers exploring Amber Fort, Hawa Mahal, Jantar Mantar and local bazaars.", u8);
        g6.setMemberCount(1);
        TravelGroup sg6 = groupRepository.save(g6);
        groupMemberRepository.save(new GroupMember(sg6, u8));

        log.info("Created 6 travel groups with memberships.");
        log.info("WanderLink demo data seeding completed successfully! 🌍");
    }
}
