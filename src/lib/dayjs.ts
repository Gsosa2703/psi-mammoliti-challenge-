import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/es";

dayjs.extend(utc);

// Default to browser locale when available, fallback to Spanish for friendlier names
try {
  if (typeof navigator !== "undefined" && navigator.language) {
    dayjs.locale(navigator.language.toLowerCase());
  } else {
    dayjs.locale("es");
  }
} catch {
  dayjs.locale("es");
}

export default dayjs;


