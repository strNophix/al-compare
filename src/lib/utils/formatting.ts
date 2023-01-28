import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export function formatTimestamp(unix: number): string {
  return dayjs(unix * 1000)
    .local()
    .format("MM-DDTHH");
}

export function formatProgress(
  current: number | null,
  total: number | null
): string {
  if (Number.isInteger(current) === false) {
    return "";
  }

  let res = current.toString();
  if (Number.isInteger(total)) res += `/${total}`;
  return res;
}
