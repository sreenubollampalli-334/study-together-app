package study_appliaction.study_together_app.dto;

public class AchievementDTO {

    private String name;
    private String description;
    private String icon;
    private int requiredStreak;

    private boolean unlocked;
    private int progress;

    // getters & setters

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public int getRequiredStreak() { return requiredStreak; }
    public void setRequiredStreak(int requiredStreak) { this.requiredStreak = requiredStreak; }

    public boolean isUnlocked() { return unlocked; }
    public void setUnlocked(boolean unlocked) { this.unlocked = unlocked; }

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }
}