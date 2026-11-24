import { describe, expect, it } from "vitest";
import {
  addDays,
  formatWeekPeriod,
  isoWeekday,
  nextWeekStart,
  weekStartOf,
  weekdaysOf,
} from "./week-period";

describe("week-period", () => {
  it("calcula o dia da semana ISO", () => {
    expect(isoWeekday("2026-09-28")).toBe(1); // segunda
    expect(isoWeekday("2026-10-02")).toBe(5); // sexta
    expect(isoWeekday("2026-10-04")).toBe(7); // domingo
  });

  it("soma dias atravessando meses e anos", () => {
    expect(addDays("2026-09-28", 4)).toBe("2026-10-02");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("encontra a segunda-feira da semana", () => {
    expect(weekStartOf("2026-10-01")).toBe("2026-09-28");
    expect(weekStartOf("2026-10-04")).toBe("2026-09-28"); // domingo pertence à semana anterior
  });

  describe("RN-19: próxima semana", () => {
    it("de segunda a domingo, sugere a segunda seguinte", () => {
      expect(nextWeekStart("2026-11-23")).toBe("2026-11-30"); // segunda
      expect(nextWeekStart("2026-11-27")).toBe("2026-11-30"); // sexta
      expect(nextWeekStart("2026-11-29")).toBe("2026-11-30"); // domingo
    });
  });

  describe("RN-10: dias úteis da semana", () => {
    it("lista segunda a sexta", () => {
      expect(weekdaysOf("2026-09-28")).toEqual([
        "2026-09-28",
        "2026-09-29",
        "2026-09-30",
        "2026-10-01",
        "2026-10-02",
      ]);
    });

    it("recusa semana que não começa na segunda", () => {
      expect(() => weekdaysOf("2026-09-29")).toThrow(/segunda-feira/);
    });
  });

  describe("RN-18: período do cabeçalho", () => {
    it("reproduz o cardápio de exemplo", () => {
      expect(formatWeekPeriod("2026-09-28")).toBe("28 A 02/10/2026");
    });

    it("funciona dentro do mesmo mês", () => {
      expect(formatWeekPeriod("2026-11-23")).toBe("23 A 27/11/2026");
    });

    it("usa o ano da sexta-feira na virada do ano", () => {
      expect(formatWeekPeriod("2026-12-28")).toBe("28 A 01/01/2027");
    });
  });

  it("recusa datas inválidas", () => {
    expect(() => addDays("28/09/2026", 1)).toThrow(/inválida/);
    expect(() => addDays("2026-02-30", 1)).toThrow(/inexistente/);
  });
});
