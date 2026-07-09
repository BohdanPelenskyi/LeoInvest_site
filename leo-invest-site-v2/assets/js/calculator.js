(function(){
  const root = document.querySelector('[data-calculator]');
  if(!root) return;

  const rates = [28.34, 26.52, 25.42, 23.94, 19.45, 18.89, 18.36, 17.84, 17.38, 16.94];
  const amountInput = root.querySelector('[data-amount]');
  const amountRange = root.querySelector('[data-amount-range]');
  const yearsInput = root.querySelector('[data-years]');
  const yearsValue = root.querySelector('[data-years-value]');
  const totalIncomeEl = root.querySelector('[data-total-income]');
  const avgYieldEl = root.querySelector('[data-avg-yield]');
  const paybackEl = root.querySelector('[data-payback]');
  const finalTotalEl = root.querySelector('[data-final-total]');
  const residualEl = root.querySelector('[data-residual]');
  const chartEl = root.querySelector('[data-chart]');
  const tableBody = root.querySelector('[data-table-body]');
  const contactBtn = root.querySelector('[data-calculator-contact]');
  const copyBtn = root.querySelector('[data-copy-result]');

  const money = value => new Intl.NumberFormat('en-US', {maximumFractionDigits: 0}).format(Math.round(value)) + ' $';
  const pct = value => value.toFixed(2).replace('.', ',') + '%';

  function cleanAmount(value){
    const numeric = Number(String(value).replace(/[^0-9.]/g,'')) || 20000;
    return Math.max(20000, Math.round(numeric / 1000) * 1000);
  }

  function computePayback(amount, incomes){
    let sum = 0;
    for(let i = 0; i < incomes.length; i++){
      const before = sum;
      sum += incomes[i];
      if(sum >= amount){
        const fraction = (amount - before) / incomes[i];
        return i + fraction + 1;
      }
    }
    return null;
  }

  function recalc(){
    const amount = cleanAmount(amountInput.value);
    const years = Math.min(10, Math.max(1, Number(yearsInput.value) || 10));
    amountInput.value = amount;
    if(amountRange) amountRange.value = amount;
    yearsInput.value = years;
    yearsValue.textContent = years + (years === 1 ? ' рік' : years < 5 ? ' роки' : ' років');

    const selectedRates = rates.slice(0, years);
    const rows = selectedRates.map((rate, index) => ({
      year: index + 1,
      rate,
      income: amount * rate / 100
    }));
    const totalIncome = rows.reduce((sum, row) => sum + row.income, 0);
    const avgYield = selectedRates.reduce((sum, rate) => sum + rate, 0) / years;
    const residual = amount * 0.5;
    const finalTotal = amount + totalIncome;
    const payback = computePayback(amount, rows.map(row => row.income));
    const maxIncome = Math.max(...rows.map(row => row.income));

    totalIncomeEl.textContent = money(totalIncome);
    avgYieldEl.textContent = pct(avgYield);
    paybackEl.textContent = payback ? `~${payback.toFixed(1).replace('.', ',')} року` : `понад ${years} років`;
    finalTotalEl.textContent = money(finalTotal);
    residualEl.textContent = money(residual);

    chartEl.innerHTML = rows.map(row => {
      const width = Math.max(7, row.income / maxIncome * 100);
      return `<div class="chart-row"><span>${row.year} рік</span><div class="chart-bar"><i style="width:${width}%"></i></div><strong>${money(row.income)}</strong></div>`;
    }).join('');

    tableBody.innerHTML = rows.map(row => `
      <tr>
        <td>${row.year} рік</td>
        <td>${pct(row.rate)}</td>
        <td>${money(row.income)}</td>
        <td>${money(rows.slice(0, row.year).reduce((s, r) => s + r.income, 0))}</td>
      </tr>
    `).join('');

    if(contactBtn){
      const text = `Доброго дня! Хочу обговорити інвестицію в Leo Invest. Орієнтовна сума: ${money(amount)}, термін розрахунку: ${years} років, прогнозний дохід: ${money(totalIncome)}.`;
      contactBtn.href = `https://t.me/leoinvest_lviv?text=${encodeURIComponent(text)}`;
    }

    root.dataset.summary = `Сума інвестиції: ${money(amount)}\nТермін: ${years} років\nЗагальний дохід: ${money(totalIncome)}\nСередня дохідність: ${pct(avgYield)}\nОкупність: ${payback ? '~' + payback.toFixed(1).replace('.', ',') + ' року' : 'понад ' + years + ' років'}\nЗалишкова вартість активу: ${money(residual)}`;
  }

  amountInput.addEventListener('input', recalc);
  amountInput.addEventListener('blur', recalc);
  if(amountRange) amountRange.addEventListener('input', () => { amountInput.value = amountRange.value; recalc(); });
  yearsInput.addEventListener('input', recalc);
  if(copyBtn){
    copyBtn.addEventListener('click', async () => {
      try{
        await navigator.clipboard.writeText(root.dataset.summary || '');
        copyBtn.textContent = 'Скопійовано';
        setTimeout(() => copyBtn.textContent = 'Скопіювати розрахунок', 1800);
      }catch(err){
        copyBtn.textContent = 'Не вдалося скопіювати';
        setTimeout(() => copyBtn.textContent = 'Скопіювати розрахунок', 1800);
      }
    });
  }
  recalc();
})();
