package com.greengrowapps.shoppinglist.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A FirebaseToken.
 */
@Entity
@Table(name = "firebase_token")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class FirebaseToken implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "token")
    private String token;

    @Column(name = "last_update")
    private ZonedDateTime lastUpdate;

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public FirebaseToken token(String token) {
        this.token = token;
        return this;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public ZonedDateTime getLastUpdate() {
        return lastUpdate;
    }

    public FirebaseToken lastUpdate(ZonedDateTime lastUpdate) {
        this.lastUpdate = lastUpdate;
        return this;
    }

    public void setLastUpdate(ZonedDateTime lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    public User getUser() {
        return user;
    }

    public FirebaseToken user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        FirebaseToken firebaseToken = (FirebaseToken) o;
        if (firebaseToken.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), firebaseToken.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "FirebaseToken{" +
            "id=" + getId() +
            ", token='" + getToken() + "'" +
            ", lastUpdate='" + getLastUpdate() + "'" +
            "}";
    }
}
