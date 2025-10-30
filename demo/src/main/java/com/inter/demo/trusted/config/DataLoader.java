package com.inter.demo.trusted.config;

import com.inter.demo.trusted.model.Community;
import com.inter.demo.trusted.model.Student;
import com.inter.demo.trusted.repo.CommunityRepository;
import com.inter.demo.trusted.service.StudentService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner seed(StudentService students, CommunityRepository communities) {
        return args -> {
            if (students.list(null).isEmpty()) {
                Student s1 = new Student("stu-001", "Aarav Sharma", "aarav@example.edu", "ABC College");
                s1.setTrustScore(78);
                s1.setSefBalance(12000);
                s1.setSefWithdrawalLimit(10000);
                s1.setMentorId("men-101");
                s1.setKycVerified(true);
                students.save(s1);

                Student s2 = new Student("stu-002", "Sara Iyer", "sara@example.edu", "ABC College");
                s2.setTrustScore(88);
                s2.setSefBalance(8000);
                s2.setSefWithdrawalLimit(8000);
                s2.setMentorId("men-101");
                s2.setKycVerified(false);
                students.save(s2);
            }

            if (communities.findAll().isEmpty()) {
                Community c1 = new Community();
                c1.setId("com-11");
                c1.setName("Code Guild");
                c1.setDescription("Friends group for coding help");
                c1.setScope("friends");
                c1.setMembers(List.of("stu-001"));
                communities.save(c1);

                Community c2 = new Community();
                c2.setId("com-22");
                c2.setName("Hostel Block A");
                c2.setDescription("Hostel community fund");
                c2.setScope("hostel");
                c2.setMembers(List.of("stu-001", "stu-002"));
                communities.save(c2);
            }
        };
    }
}
