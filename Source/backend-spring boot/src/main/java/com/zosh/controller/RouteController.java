package com.zosh.controller;

import com.zosh.model.Address;
import com.zosh.model.Restaurant;
import com.zosh.model.User;
import com.zosh.repository.RestaurantRepository;
import com.zosh.repository.UserRepository;
import com.zosh.service.GoogleMapsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/route")
public class RouteController {

    @Autowired
    private GoogleMapsService maps;

    @Autowired
    private RestaurantRepository restaurantRepo;

    @Autowired
    private UserRepository userRepo;

    /**
     * Automatically compute route from a restaurant to the current user.
     *
     * @param restaurantId the ID of the restaurant
     * @param userId       the ID of the user
     */
    @GetMapping("/auto")
    public Map<String, Object> getAutoRoute(
            @RequestParam Long restaurantId,
            @RequestParam Long userId
    ) {
        // 1️⃣ Fetch entities
        Restaurant rest = restaurantRepo.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid restaurantId"));
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid userId"));

        // 2️⃣ Pull & validate restaurant address
        Address restAddr = rest.getAddress();
        if (restAddr == null) {
            throw new IllegalArgumentException("Restaurant has no address");
        }
        String origin = formatAddress(restAddr);

        // 3️⃣ Pull & validate user address list
        Address userAddr = user.getAddresses().stream()
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("User has no address"));
        String destination = formatAddress(userAddr);

        // 4️⃣ Call Google Maps and return combined result
        return Map.of(
                "origin",       origin,
                "destination",  destination,
                "maps",         maps.getRoute(origin, destination)
        );
    }

    /**
     * Helper that flattens an Address entity into a single-line string.
     */
    private String formatAddress(Address addr) {
        return String.join(", ",
                addr.getStreetAddress(),
                addr.getCity(),
                addr.getState(),
                addr.getPostalCode(),
                addr.getCountry()
        );
    }
}
