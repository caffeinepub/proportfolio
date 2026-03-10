import Array "mo:core/Array";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat64 "mo:core/Nat64";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Profile = {
    name : Text;
    title : Text;
    bio : Text;
    location : Text;
    email : Text;
    linkedIn : Text;
    github : Text;
    avatarUrl : Text;
  };

  type WorkExperience = {
    company : Text;
    role : Text;
    startDate : Nat64;
    endDate : ?Nat64;
    description : Text;
  };

  module WorkExperience {
    public func compare(a : WorkExperience, b : WorkExperience) : Order.Order {
      switch (Int.compare(b.startDate.toNat(), a.startDate.toNat())) {
        case (#equal) { Text.compare(a.company, b.company) };
        case (order) { order };
      };
    };
  };

  type Education = {
    institution : Text;
    degree : Text;
    field : Text;
    startYear : Nat64;
    endYear : ?Nat64;
  };

  module Education {
    public func compare(a : Education, b : Education) : Order.Order {
      switch (Int.compare(b.startYear.toNat(), a.startYear.toNat())) {
        case (#equal) { Text.compare(a.institution, b.institution) };
        case (order) { order };
      };
    };
  };

  type Skill = {
    name : Text;
    category : Text;
    progress : Nat;
    achieved : Bool;
    achievedDate : ?Int;
  };

  module Skill {
    public func compare(a : Skill, b : Skill) : Order.Order {
      switch (a.achieved, b.achieved) {
        case (true, false) { #less };
        case (false, true) { #greater };
        case (_) { Text.compare(a.name, b.name) };
      };
    };
  };

  type Hobby = {
    name : Text;
    description : Text;
    icon : Text;
  };

  module Hobby {
    public func compare(a : Hobby, b : Hobby) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  type Portfolio = {
    profile : Profile;
    workExperience : [WorkExperience];
    education : [Education];
    skills : [Skill];
    hobbies : [Hobby];
  };

  let workExperienceEntries = Map.empty<Nat, WorkExperience>();
  let educationEntries = Map.empty<Nat, Education>();
  let skillEntries = Map.empty<Nat, Skill>();
  let hobbyEntries = Map.empty<Nat, Hobby>();
  var currentProfile : ?Profile = null;
  var nextId = 0;

  func getNextId() : Nat {
    let id = nextId;
    nextId += 1;
    id;
  };

  public query ({ caller }) func getFullPortfolio() : async Portfolio {
    {
      profile = switch (currentProfile) {
        case (null) { Runtime.trap("No profile found") };
        case (?profile) { profile };
      };
      workExperience = workExperienceEntries.values().toArray().sort();
      education = educationEntries.values().toArray().sort();
      skills = skillEntries.values().toArray().sort();
      hobbies = hobbyEntries.values().toArray().sort();
    };
  };

  public shared ({ caller }) func updateProfile(profile : Profile) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update profile");
    };
    currentProfile := ?profile;
  };

  public shared ({ caller }) func addWorkExperience(entry : WorkExperience) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add work experience");
    };
    let id = getNextId();
    workExperienceEntries.add(id, entry);
    id;
  };

  public shared ({ caller }) func updateWorkExperience(id : Nat, entry : WorkExperience) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update work experience");
    };
    if (not workExperienceEntries.containsKey(id)) {
      Runtime.trap("Work experience entry not found");
    };
    workExperienceEntries.add(id, entry);
  };

  public shared ({ caller }) func removeWorkExperience(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can remove work experience");
    };
    if (not workExperienceEntries.containsKey(id)) {
      Runtime.trap("Work experience entry not found");
    };
    workExperienceEntries.remove(id);
  };

  public shared ({ caller }) func addEducation(entry : Education) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add education");
    };
    let id = getNextId();
    educationEntries.add(id, entry);
    id;
  };

  public shared ({ caller }) func updateEducation(id : Nat, entry : Education) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update education");
    };
    if (not educationEntries.containsKey(id)) {
      Runtime.trap("Education entry not found");
    };
    educationEntries.add(id, entry);
  };

  public shared ({ caller }) func removeEducation(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can remove education");
    };
    if (not educationEntries.containsKey(id)) {
      Runtime.trap("Education entry not found");
    };
    educationEntries.remove(id);
  };

  public shared ({ caller }) func addSkill(skill : Skill) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add skills");
    };
    let id = getNextId();
    skillEntries.add(id, skill);
    id;
  };

  public shared ({ caller }) func updateSkill(id : Nat, skill : Skill) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update skills");
    };
    if (not skillEntries.containsKey(id)) {
      Runtime.trap("Skill not found");
    };
    skillEntries.add(id, skill);
  };

  public shared ({ caller }) func updateSkillProgress(id : Nat, progress : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update skill progress");
    };
    switch (skillEntries.get(id)) {
      case (null) { Runtime.trap("Skill not found") };
      case (?existing) {
        let updatedSkill = {
          existing with
          progress = if (progress > 100) { 100 } else { progress };
        };
        skillEntries.add(id, updatedSkill);
      };
    };
  };

  public shared ({ caller }) func markSkillAchieved(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can mark skills as achieved");
    };
    switch (skillEntries.get(id)) {
      case (null) { Runtime.trap("Skill not found") };
      case (?existing) {
        let updatedSkill = {
          existing with
          achieved = true;
          achievedDate = ?Time.now();
        };
        skillEntries.add(id, updatedSkill);
      };
    };
  };

  public shared ({ caller }) func removeSkill(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can remove skills");
    };
    if (not skillEntries.containsKey(id)) {
      Runtime.trap("Skill not found");
    };
    skillEntries.remove(id);
  };

  public shared ({ caller }) func addHobby(hobby : Hobby) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add hobbies");
    };
    let id = getNextId();
    hobbyEntries.add(id, hobby);
    id;
  };

  public shared ({ caller }) func updateHobby(id : Nat, hobby : Hobby) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update hobbies");
    };
    if (not hobbyEntries.containsKey(id)) {
      Runtime.trap("Hobby not found");
    };
    hobbyEntries.add(id, hobby);
  };

  public shared ({ caller }) func removeHobby(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can remove hobbies");
    };
    if (not hobbyEntries.containsKey(id)) {
      Runtime.trap("Hobby not found");
    };
    hobbyEntries.remove(id);
  };
};
