package com.agriculture.service;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

@Service
public class FarmingCalendarService {

    public Map<String, Object> getYearlyCalendar(
            String location, String soilType) {

        Map<String, Object> result = new LinkedHashMap<>();
        int currentMonth = LocalDate.now().getMonthValue();
        String currentMonthName = LocalDate.now()
            .getMonth().name();

        result.put("location", location);
        result.put("soilType", soilType);
        result.put("currentMonth", currentMonth);
        result.put("currentMonthName", currentMonthName);
        result.put("currentSeason",
            getCurrentSeason(currentMonth));
        result.put("nextSowingDate",
            getNextSowingDate(currentMonth));
        result.put("kharif",  getKharifCalendar());
        result.put("rabi",    getRabiCalendar());
        result.put("summer",  getSummerCalendar());
        result.put("organicTips", getOrganicTips());
        result.put("yearPlan",
            getFullYearPlan(soilType));

        return result;
    }

    private List<Map<String,Object>> getKharifCalendar() {
        List<Map<String,Object>> list = new ArrayList<>();

        list.add(createMonth("June", "🌧️",
            "நெல் / சோளம் விதைக்கவும்",
            "Sow Rice and Maize",
            "நிலத்தை உழுது மண்புழு உரம் @ 5 டன்/ஹெக்டேர்",
            "Rice, Maize, Groundnut",
            "நெல், சோளம், நிலக்கடலை",
            "SOWING", 6));

        list.add(createMonth("July", "💧",
            "நீர் பாசனம் — களை எடுங்கள்",
            "Irrigation and weeding",
            "வேப்பம் பிண்ணாக்கு @ 250 கிலோ/ஹெக்டேர் இடுங்கள்",
            "Rice, Cotton",
            "நெல், பருத்தி",
            "GROWING", 7));

        list.add(createMonth("August", "🌿",
            "பூச்சி கண்காணிப்பு — நோய் சோதனை",
            "Pest monitoring and disease check",
            "வேப்ப எண்ணெய் 3% தெளிக்கவும் — பூச்சி விரட்டும்",
            "Rice, Cotton",
            "நெல், பருத்தி",
            "GROWING", 8));

        list.add(createMonth("September", "🌸",
            "பூக்கும் தருணம் — சத்து கொடுங்கள்",
            "Flowering stage — apply nutrients",
            "பஞ்சகவ்யா @ 3% தெளிக்கவும் — மகசூல் அதிகரிக்கும்",
            "Rice, Maize",
            "நெல், சோளம்",
            "FLOWERING", 9));

        list.add(createMonth("October", "🌾",
            "அறுவடைக்கு தயார் — நீர் நிறுத்துங்கள்",
            "Prepare for harvest — stop irrigation",
            "அறுவடை 2 வாரம் முன் நீர்ப்பாசனம் நிறுத்துங்கள்",
            "Rice, Maize",
            "நெல், சோளம்",
            "PRE_HARVEST", 10));

        list.add(createMonth("November", "🚜",
            "அறுவடை செய்யுங்கள்!",
            "Harvest time!",
            "அறுவடை பின் மண்ணில் உயிரி உரம் இடுங்கள்",
            "Rice, Groundnut",
            "நெல், நிலக்கடலை",
            "HARVEST", 11));

        return list;
    }

    private List<Map<String,Object>> getRabiCalendar() {
        List<Map<String,Object>> list = new ArrayList<>();

        list.add(createMonth("December", "❄️",
            "ரபி பயிர் விதைக்கவும்",
            "Sow Rabi crops",
            "பசுந்தாள் உரம் இடுங்கள் — மண் வளம் அதிகரிக்கும்",
            "Wheat, Groundnut",
            "கோதுமை, கடலை",
            "SOWING", 12));

        list.add(createMonth("January", "💧",
            "நீர் மேலாண்மை கவனிக்கவும்",
            "Careful water management",
            "காலை நேர நீர்ப்பாசனம் சிறந்தது",
            "Groundnut, Wheat",
            "கடலை, கோதுமை",
            "GROWING", 1));

        list.add(createMonth("February", "🌿",
            "பயிர் வளர்ச்சி கண்காணிக்கவும்",
            "Monitor crop growth",
            "ஜீவாமிர்தம் @ 200 லிட்டர்/ஏக்கர் தெளிக்கவும்",
            "Sunflower, Wheat",
            "சூரியகாந்தி, கோதுமை",
            "FLOWERING", 2));

        list.add(createMonth("March", "🌾",
            "அறுவடை செய்யுங்கள்",
            "Harvest Rabi crops",
            "அறுவடை பின் மண் பரிசோதனை செய்யுங்கள்",
            "Wheat, Groundnut",
            "கோதுமை, கடலை",
            "HARVEST", 3));

        return list;
    }

    private List<Map<String,Object>> getSummerCalendar() {
        List<Map<String,Object>> list = new ArrayList<>();

        list.add(createMonth("April", "☀️",
            "கோடை பயிர் அல்லது மண் ஓய்வு",
            "Summer crop or soil rest",
            "மண்ணை ஓய்வு கொடுங்கள் — மக்கிய உரம் இடுங்கள்",
            "Green Gram, Sesame",
            "பச்சை பயிறு, எள்",
            "PREPARATION", 4));

        list.add(createMonth("May", "🌱",
            "கரீஃப் தயாரிப்பு தொடங்குங்கள்",
            "Start Kharif preparation",
            "மண் பரிசோதனை + உயிரி உரம் தயார் செய்யுங்கள்",
            "Soil Preparation",
            "மண் தயாரிப்பு",
            "PREPARATION", 5));

        return list;
    }

    private Map<String,Object> createMonth(
            String name, String icon,
            String actionTamil, String actionEnglish,
            String organicTip, String cropsEnglish,
            String cropsTamil, String stage, int monthNum) {
        Map<String,Object> m = new LinkedHashMap<>();
        m.put("month", name);
        m.put("monthNum", monthNum);
        m.put("icon", icon);
        m.put("actionTamil", actionTamil);
        m.put("actionEnglish", actionEnglish);
        m.put("organicTip", organicTip);
        m.put("cropsEnglish", cropsEnglish);
        m.put("cropsTamil", cropsTamil);
        m.put("stage", stage);
        m.put("isCurrent",
            monthNum == LocalDate.now().getMonthValue());
        return m;
    }

    private List<Map<String,String>> getOrganicTips() {
        List<Map<String,String>> tips = new ArrayList<>();

        tips.add(tip("🐄 மண்புழு உரம்",
            "Vermicompost",
            "100 கிலோ/ஹெக்டேர் மண்புழு உரம் இடுங்கள். மண் வளம் 40% அதிகரிக்கும்.",
            "Apply 100 kg/hectare. Increases soil fertility by 40%."));

        tips.add(tip("🌿 பஞ்சகவ்யா",
            "Panchagavya",
            "3% கரைசல் தெளிக்கவும். பயிர் வளர்ச்சி துரிதமாகும். மாடு சாணம் தேவை.",
            "Spray 3% solution. Accelerates crop growth naturally."));

        tips.add(tip("🍃 ஜீவாமிர்தம்",
            "Jeevamrutham",
            "200 லிட்டர்/ஏக்கர் நீர்ப்பாசனத்தில் கலக்கவும். மண் நுண்ணுயிர் அதிகரிக்கும்.",
            "Mix 200L/acre in irrigation water. Boosts soil microbes."));

        tips.add(tip("🌱 பசுந்தாள் உரம்",
            "Green Manure",
            "தக்கைப்பூண்டு 45 நாளில் உழுது மடக்குங்கள். நைட்ரஜன் அதிகரிக்கும்.",
            "Plow under Sunnhemp at 45 days for nitrogen fixation."));

        tips.add(tip("🌾 வேப்பம் பிண்ணாக்கு",
            "Neem Cake",
            "250 கிலோ/ஹெக்டேர் இடுங்கள். பூச்சி தாக்குதல் இயற்கையாக குறையும்.",
            "Apply 250 kg/hectare. Naturally reduces pest attacks."));

        tips.add(tip("💧 சொட்டு நீர்ப்பாசனம்",
            "Drip Irrigation",
            "40% நீர் மிச்சம். 90% மானியம் அரசு தருகிறது. உடனே விண்ணப்பிக்கவும்.",
            "Save 40% water. 90% government subsidy available."));

        tips.add(tip("🐛 இயற்கை பூச்சி விரட்டி",
            "Bio Pest Control",
            "வேப்ப எண்ணெய் 3% + சோப்பு நீர் கலந்து தெளிக்கவும். நஞ்சு இல்லை.",
            "Spray 3% neem oil + soap water. No chemicals needed."));

        tips.add(tip("🌍 மண் பரிசோதனை",
            "Soil Testing",
            "6 மாதத்திற்கு ஒரு முறை மண் பரிசோதனை செய்யுங்கள். இலவசம்.",
            "Test soil every 6 months at government lab. Free service."));

        return tips;
    }

    private Map<String,String> tip(
            String nameTamil, String nameEnglish,
            String descTamil, String descEnglish) {
        Map<String,String> t = new LinkedHashMap<>();
        t.put("nameTamil", nameTamil);
        t.put("nameEnglish", nameEnglish);
        t.put("descTamil", descTamil);
        t.put("descEnglish", descEnglish);
        return t;
    }

    private List<Map<String,String>> getFullYearPlan(
            String soilType) {
        List<Map<String,String>> plan = new ArrayList<>();
        String[] months = {"January","February","March",
            "April","May","June","July","August",
            "September","October","November","December"};
        String[] tamilMonths = {"ஜனவரி","பிப்ரவரி","மார்ச்",
            "ஏப்ரல்","மே","ஜூன்","ஜூலை","ஆகஸ்ட்",
            "செப்டம்பர்","அக்டோபர்","நவம்பர்","டிசம்பர்"};
        String[] actions = {
            "கடலை அறுவடை",
            "மண் தயாரிப்பு",
            "கோடை பயிர்",
            "மண் ஓய்வு",
            "நிலம் உழவு",
            "நெல் விதைப்பு",
            "நீர் பாசனம்",
            "களை எடுத்தல்",
            "நோய் கண்காணிப்பு",
            "அறுவடை தயாரிப்பு",
            "நெல் அறுவடை",
            "ரபி விதைப்பு"
        };
        int currentMonth = LocalDate.now()
            .getMonthValue();
        for (int i = 0; i < 12; i++) {
            Map<String,String> m = new LinkedHashMap<>();
            m.put("month", months[i]);
            m.put("monthTamil", tamilMonths[i]);
            m.put("action", actions[i]);
            m.put("isCurrent",
                String.valueOf(i + 1 == currentMonth));
            plan.add(m);
        }
        return plan;
    }

    private String getCurrentSeason(int month) {
        if (month >= 6 && month <= 11) return "KHARIF";
        if (month >= 12 || month <= 3) return "RABI";
        return "SUMMER";
    }

    private String getNextSowingDate(int month) {
        if (month >= 3 && month <= 5)
            return "June 1 — Kharif season / நெல் விதைப்பு தொடங்கும்";
        if (month >= 9 && month <= 11)
            return "December 1 — Rabi season / கடலை விதைப்பு தொடங்கும்";
        if (month >= 12 || month <= 2)
            return "April 15 — Summer crop / பச்சை பயிறு விதைக்கலாம்";
        return "Current season ongoing — தொடர்ந்து பராமரிக்கவும்";
    }
}