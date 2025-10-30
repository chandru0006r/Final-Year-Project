package com.inter.demo.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class user{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long Uid;
	
	private String name;
	private String password;
	private String country;
	private String state;
	private String email;
	private LocalDateTime registereddate;
	
	
	public user() {}
	
	public user(String name, String password, String country, String state, String email,
			LocalDateTime registereddate) {
		super();
		this.name = name;
		this.password = password;
		this.country = country;
		this.state = state;
		this.email = email;
		this.registereddate = registereddate;
	}
	

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public LocalDateTime getRegistereddate() {
		return registereddate;
	}

	public void setRegistereddate(LocalDateTime registereddate) {
		this.registereddate = registereddate;
	}

	public void setUid(long uid) {
		Uid = uid;
	}

	@Override
	public String toString() {
		return "user [Uid=" + Uid + ", name=" + name + ", password=" + password + ", country=" + country + ", state="
				+ state + ", email=" + email + ", registereddate=" + registereddate + "]";
	}


	
}
